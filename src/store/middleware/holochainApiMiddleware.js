import { connect } from '@holochain/hc-web-client'

export default function holochainApiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action

    if (!payload || !payload.holochainApi) return next(action)

    const { path, params } = payload.holochainApi

    var promise = holoFetchJSON(path, params)

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({...action, payload: promise})
  }
}

export function holoFetchJSON (path, params) {
  return connect(process.env.HOLO_CHAT_API_HOST).then(connection =>
    connection.call(path)(params))
}
