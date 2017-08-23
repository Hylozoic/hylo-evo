import { SIGNUP } from 'store/constants'

export function signup (fullName, email, password) {
  return {
    type: SIGNUP,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user',
        params: {
          fullName,
          email,
          password,
          login: true
        }
      }
    }
  }
}
