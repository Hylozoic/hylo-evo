import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { get, pick } from 'lodash/fp'
import authWithService from './authWithService'
import { LOGIN, LOGOUT } from 'store/constants'

export const CHECK_LOGIN = 'CHECK_LOGIN'

export function login (email, password) {
  return {
    type: LOGIN,
    payload: {
      api: {method: 'post', path: '/noo/login', params: {email, password}}
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
      api: {path: '/noo/user/status'}
    }
  }
}

export function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: {path: '/noo/session', method: 'DELETE'}
    },
    meta: {
      then: () => {
        window.location.href = '/login'
      }
    }
  }
}

const reducer = combineReducers({
  isLoggedIn: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
    }
    return state
  },

  error: (state = null, { type, error, payload }) => {
    if (error && type === LOGIN) return payload.message
    return state
  }
})

export default reducer

export const pickIsLoggedIn = createSelector(
  get('Login'),
  pick('isLoggedIn')
)

export const pickError = createSelector(
  get('Login'),
  pick('error')
)
