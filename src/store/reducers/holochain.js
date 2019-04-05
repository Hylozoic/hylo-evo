import { SET_HOLOCHAIN_SOCKET } from '../constants'

const HOLOCHAIN_MODE_SUBDOMAIN = 'holo'
const active = typeof window !== 'undefined' &&
  window.location.host.split('.')[0] === HOLOCHAIN_MODE_SUBDOMAIN

export const initialState = {
  active,
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
