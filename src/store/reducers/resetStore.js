import { pick } from 'lodash/fp'
import { initialState } from '..'
import { LOGOUT } from 'routes/NonAuthLayout/Login/Login.store.js'
import { RESET_STORE } from '../constants'

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    return {
      ...initialState,
      login: {
        isLoggedIn: false
      }
    }
  }

  if (action.type === RESET_STORE && !action.error) {
    return {
      ...initialState,
      ...pick([
        'login',
        'pending',
        'locationHistory',
        'intercom',
        'mixpanel'
      ], state)
    }
  }

  return state
}
