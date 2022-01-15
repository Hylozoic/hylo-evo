import { combineReducers } from 'redux'
import { CHECK_LOGIN, LOGIN } from 'store/constants'
import { SEND_EMAIL_VERIFICATION, SIGNUP, VERIFY_EMAIL } from 'routes/NonAuthLayout/Signup/Signup.store'
import { OAUTH_CANCEL, OAUTH_CONFIRM } from 'routes/NonAuthLayout/OAuth/Consent/Consent.store'

export default combineReducers({
  verifiedEmail: (state = null, { type, error, payload }) => {
    if (error) return state
    switch (type) {
      case VERIFY_EMAIL: return payload
    }
    return state
  },

  isLoggedIn: (state = null, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case SIGNUP:
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
    }
    return state
  },

  error: (state = null, { type, error, payload }) => {
    if (error && ([LOGIN, SIGNUP, VERIFY_EMAIL, SEND_EMAIL_VERIFICATION, OAUTH_CONFIRM, OAUTH_CANCEL].includes(type))) return payload.message
    if (!error) return ''
    return state
  }
})
