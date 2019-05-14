import { combineReducers } from 'redux'
import { CHECK_LOGIN, LOGIN, SIGNUP, SET_LOGIN } from 'store/constants'

export default combineReducers({
  isLoggedIn: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case SIGNUP:
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
      case SET_LOGIN: return !!payload.signedIn
    }
    return state
  },

  error: (state = null, { type, error, payload }) => {
    if (error && (type === LOGIN || type === SIGNUP)) return payload.message
    return state
  }
})
