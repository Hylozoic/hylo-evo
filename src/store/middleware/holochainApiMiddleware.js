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

var holoCall

export async function holoFetchJSON (path, params) {
  if (!holoCall) {
    return connect(process.env.HOLO_CHAT_API_HOST)
      .then(connection => {
        holoCall = connection.call
      }).then(() =>
        holoCall(path)(params))
  }

  return new Promise((resolve, reject) => resolve(holoCall(path)(params)))
}
