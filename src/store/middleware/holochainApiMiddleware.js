import { connect as holochainSocketConnect } from '@holochain/hc-web-client'
import setHolochainSocket from '../actions/setHolochainSocket'
import getHolochainSocket from '../selectors/getHolochainSocket'

export default function holochainApiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action

    if (!payload || !payload.holochainApi) return next(action)

    const { path, params } = payload.holochainApi
    const state = store.getState()
    let promise = initAndGetHolochainSocket(state, store.dispatch).then(holochainSocket =>
      holochainSocket.call(path)(params)
    )

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({...action, payload: promise})
  }
}

export async function initAndGetHolochainSocket (state, dispatch) {
  let holochainSocket = getHolochainSocket(state)

  if (!holochainSocket) {
    holochainSocket = await holochainSocketConnect(process.env.HOLO_CHAT_API_HOST)
    dispatch(setHolochainSocket(holochainSocket))
  }

  return holochainSocket
}
