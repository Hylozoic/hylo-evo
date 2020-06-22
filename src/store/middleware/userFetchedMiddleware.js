import { get } from 'lodash/fp'
import getMe from '../selectors/getMe'
import getMixpanel from '../selectors/getMixpanel'
import getIntercom from '../selectors/getIntercom'

export default function userFetchedMiddleware ({ dispatch, getState }) {
  return next => action => {
    const wasMe = getMe(getState())
    const result = next(action)
    const isMe = getMe(getState())
    const userFetched = !get('name', wasMe) && get('name', isMe)
    if (userFetched) {
      const state = getState()
      identifyMixpanelUser(state)
      registerIntercomUser(state)
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
  const intercom = getIntercom(state)
  intercom('update', {
    user_hash: user.intercomHash,
    email: user.email,
    name: user.name,
    user_id: user.id
  })
}
