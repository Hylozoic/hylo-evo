import { CHECK_LOGIN, LOGIN } from 'store/constants'

export function login (email, password) {
  return {
    type: LOGIN,
    payload: {
      api: {method: 'post', path: '/noo/login', params: {email, password}}
    }
  }
}

export function checkLogin () {
  return {
    type: CHECK_LOGIN,
    payload: {
      api: {path: '/noo/user/status'}
    }
  }
}
