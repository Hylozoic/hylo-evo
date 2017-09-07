import { SIGNUP } from 'store/constants'

export function signup (name, email, password) {
  return {
    type: SIGNUP,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user',
        params: {
          name,
          email,
          password,
          login: true
        }
      }
    }
  }
}
