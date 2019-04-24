import { SET_HOLOCHAIN_SOCKET } from 'store/constants'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

export const initialState = {
  active: HOLOCHAIN_ACTIVE,
  socket: null
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_HOLOCHAIN_SOCKET:
      return { ...state, socket: payload }
    default:
      return state
  }
}
