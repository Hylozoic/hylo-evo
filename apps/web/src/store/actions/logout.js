import { LOGOUT } from 'store/constants'

export default function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: { path: '/noo/session', method: 'DELETE' }
    }
  }
}
