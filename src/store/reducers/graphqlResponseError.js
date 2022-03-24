import { LOGIN, SIGNUP } from 'store/constants'
import { SEND_EMAIL_VERIFICATION, VERIFY_EMAIL } from 'routes/NonAuthLayout/Signup/Signup.store.js'

export default function graphqlResponseError (state = null, { type, payload }) {
  if (![LOGIN, SIGNUP, VERIFY_EMAIL, SEND_EMAIL_VERIFICATION].includes(type)) return state

  const resolverKey = payload?.data && Object.keys(payload.data)[0]

  if (resolverKey) {
    const error = payload.data[resolverKey]?.error

    if (error) return error
  }

  return state
}
