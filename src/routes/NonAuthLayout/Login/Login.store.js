import authWithService from './authWithService'
import { CHECK_LOGIN, LOGIN, LOGOUT, SET_LOGIN } from 'store/constants'

export function login (email, password) {
  return {
    type: LOGIN,
    payload: {
      api: { method: 'post', path: '/noo/login', params: { email, password } }
    }
  }
}

export function loginWithService (name) {
  return {
    type: LOGIN,
    payload: authWithService(name)
  }
}

export function checkLogin () {
  return {
    type: CHECK_LOGIN,
    payload: {
      api: { path: '/noo/user/status' }
    }
  }
}

export function setLogin (signedIn) {
  return {
    type: SET_LOGIN,
    payload: {
      signedIn
    }
  }
}

export function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: { path: '/noo/session', method: 'DELETE' }
    },
    meta: {
      then: () => {
        window.location.href = '/login'
      }
    }
  }
}
