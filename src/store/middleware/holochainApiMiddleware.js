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
    const connection = await connect(process.env.HOLO_CHAT_API_HOST)
    holoCall = connection.call
  }

  return holoCall(path)(params)
}
