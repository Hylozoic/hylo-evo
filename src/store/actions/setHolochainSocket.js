import { SET_HOLOCHAIN_SOCKET } from '../constants'

export default function setHolochainSocket (holochainSocketConnection) {
  return {
    type: SET_HOLOCHAIN_SOCKET,
    payload: holochainSocketConnection
  }
}
