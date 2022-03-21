import { combineReducers } from 'redux'
import { LOGIN, RESET_RETURN_TO_URL, SET_RETURN_TO_URL, SIGNUP } from 'store/constants'
import { SEND_EMAIL_VERIFICATION, VERIFY_EMAIL } from 'routes/NonAuthLayout/Signup/Signup.store.js'

export default combineReducers({
  returnToURL: (state = null, { type, error, payload, meta}) => {
    switch (type) {
      case SET_RETURN_TO_URL: {
        return payload.returnToURL
      }
      case RESET_RETURN_TO_URL: {
        return null
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
