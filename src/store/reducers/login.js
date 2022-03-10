import { combineReducers } from 'redux'
import { CHECK_LOGIN, LOGIN } from 'store/constants'
import { SEND_EMAIL_VERIFICATION, SIGNUP, VERIFY_EMAIL } from 'routes/NonAuthLayout/Signup/Signup.store.js'

export default combineReducers({
  isLoggedIn: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case VERIFY_EMAIL:
      case SIGNUP:
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.data.me
    }
    return state
  },

  error: (state = null, { type, error, payload }) => {
    if (error && (type === LOGIN || type === SIGNUP || type === VERIFY_EMAIL || type === SEND_EMAIL_VERIFICATION)) return payload.message
    if (!error) return ''
    return state
  }
})
