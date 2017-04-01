import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { get, pick } from 'lodash/fp'
import authWithService from './authWithService'

const CHECK_LOGIN = 'CHECK_LOGIN'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

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
    }
  }
}

const reducer = combineReducers({
  isLoggedIn: (state = false, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
      case LOGOUT: return false
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
  get('login'),
  pick('isLoggedIn')
)

export const pickError = createSelector(
  get('login'),
  pick('error')
)
