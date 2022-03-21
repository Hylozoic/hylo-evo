import { combineReducers } from 'redux'
import { CHECK_LOGIN, LOGIN, SIGNUP } from 'store/constants'
import { SEND_EMAIL_VERIFICATION, VERIFY_EMAIL } from 'routes/NonAuthLayout/Signup/Signup.store.js'

export default combineReducers({
  isLoggedIn: (state = null, { type, error: thrownError, payload, meta }) => {
    if (thrownError) return state
    switch (type) {
      case LOGIN:
      case CHECK_LOGIN: {
        return !!payload.data.me
      }
    }

    return state
  },

  error: (state = null, { type, payload }) => {
    if (![LOGIN, SIGNUP, VERIFY_EMAIL, SEND_EMAIL_VERIFICATION].includes(type)) return state

    const resolverKey = payload?.data && Object.keys(payload.data)[0]

    if (resolverKey) {
      const error = payload.data[resolverKey]?.error

      if (error) return error
    }

    return state
  }
})
