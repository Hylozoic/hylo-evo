import getMe from '../selectors/getMe'
import getMixpanel from '../selectors/getMixpanel'
import { IntercomAPI } from 'react-intercom'
import { isProduction } from '../../config'

export default function userFetchedMiddleware ({ getState }) {
  return next => action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())
    const userFetched = !wasMe && isMe
    if (userFetched) {
      const state = getState()
      // Do these things with the currentUser the first time it's fetched in a session
      isProduction && identifyMixpanelUser(state)
      isProduction && registerIntercomUser(state)
    }
    return result
  }
}

export function identifyMixpanelUser (state) {
  const user = getMe(state)
  const mixpanel = getMixpanel(state)
  mixpanel.identify(user.id)
  mixpanel.people.set({
    '$name': user.name,
    '$email': user.email,
    '$location': user.location
  })
}

export function registerIntercomUser (state) {
  const user = getMe(state)
  console.log(IntercomAPI)
  IntercomAPI('update', {
    user_hash: user.hash,
    userId: user.id,
    email: user.email,
    name: user.name,
    user_id: user.id
  })
}
