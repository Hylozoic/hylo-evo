import authWithService from './authWithService'
import { CHECK_LOGIN, LOGIN, LOGOUT } from 'store/constants'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

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
  if (HOLOCHAIN_ACTIVE) return mockCheckLogin()

  return {
    type: CHECK_LOGIN,
    payload: {
      api: { path: '/noo/user/status' }
    }
  }
}

export function mockCheckLogin () {
  return {
    type: CHECK_LOGIN,
    payload: {
      signedIn: true
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
