import { connect as holochainSocketConnect } from '@holochain/hc-web-client'
import setHolochainSocket from '../actions/setHolochainSocket'
import getHolochainSocket from '../selectors/getHolochainSocket'

export default function holochainApiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action

    if (!payload || !payload.holochainApi) return next(action)

    const { path, params } = payload.holochainApi
    const state = store.getState()

    var holochainSocket = getHolochainSocket(state)
    var promise = Promise.resolve()

    if (!holochainSocket) {
      promise = holochainSocketConnect(process.env.HOLO_CHAT_API_HOST).then(connection => {
        holochainSocket = connection
        store.dispatch(setHolochainSocket(holochainSocket))
      })
    }

    promise = promise.then(() => holochainSocket.call(path)(params))

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({...action, payload: promise})
  }
}
