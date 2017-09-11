import { combineReducers } from 'redux'
import { CHECK_LOGIN, LOGIN, SIGNUP, SET_RETURN_TO_URL, RESET_RETURN_TO_URL } from 'store/constants'

export default combineReducers({
  isLoggedIn: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case SIGNUP:
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
    }
    return state
  },

  returnToURL: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case SET_RETURN_TO_URL:
        return payload.returnToURL
      case RESET_RETURN_TO_URL:
        return null
    }
    return state
  },

  error: (state = null, { type, error, payload }) => {
    if (error && (type === LOGIN || type === SIGNUP)) return payload.message
    return state
  }
})
