import { SET_HOLOCHAIN_SOCKET } from '../constants'

export default (state = null, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_HOLOCHAIN_SOCKET:
      return payload
    default:
      return state
  }
}
