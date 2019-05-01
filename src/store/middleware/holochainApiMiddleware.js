import { connect as holochainSocketConnect } from '@holochain/hc-web-client'
import { createCallObjectWithParams } from 'util/holochain'
import setHolochainSocket from '../actions/setHolochainSocket'
import getHolochainSocket from '../selectors/getHolochainSocket'

export default function holochainApiMiddleware (req) {
  return ({ getState, dispatch }) => next => action => {
    const { payload, meta } = action

    if (!payload || !payload.holochainApi) return next(action)

    const { params } = payload.holochainApi

    let promise = initAndGetHolochainSocket(getState(), dispatch).then(holochainSocket => {
      const callObject = createCallObjectWithParams(params)

      return holochainSocket.call('call')(callObject)
    })

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({ ...action, payload: promise })
  }
}

export function initAndGetHolochainSocket (state, dispatch) {
  let holochainSocket = getHolochainSocket(state)

  if (holochainSocket) return Promise.resolve(holochainSocket)

  return holochainSocketConnect(process.env.HOLO_CHAT_API_HOST).then(socket => {
    dispatch(setHolochainSocket(socket))
    return socket
  })
}
