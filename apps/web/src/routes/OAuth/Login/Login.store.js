import { LOGIN } from 'store/constants'

export function login (uid, email, password) {
  return {
    type: LOGIN,
    payload: {
      api: { method: 'post', path: `/noo/oidc/${uid}/login`, params: { email, password } }
    }
  }
}
