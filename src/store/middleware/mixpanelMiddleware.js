import { get, isString, isObject, omit } from 'lodash/fp'
import getMixpanel from '../selectors/getMixpanel'
import { getAuthenticated } from '../selectors/getSignupState'
import getMe from '../selectors/getMe'
import { isDev } from 'config'

export default function mixpanelMiddleware (store) {
  return next => action => {
    const { type, meta } = action

    if (!type.match(/_PENDING$/) && meta && meta.analytics) {
      // meta.analytics can be either simply true, a string (name of event) or a hash
      // with data that will be attached to the event sent to mixpanel (eventName being
      // a required key).
      //
      // NOTE: the mixpanel object is initialized in initialState of the store creation
      const state = store.getState()
      const mixpanel = getMixpanel(state)

      if (isDev || !mixpanel) return next(action)

      const isLoggedIn = getAuthenticated(state)
      const { analytics } = meta
      const trackingEventName = get('eventName', analytics) ||
        (isString(analytics) && analytics) ||
        type
      const analyticsData = isObject(analytics) ? omit('eventName', analytics) : {}

      if (isLoggedIn) mixpanel.identify(getMe(state).id)

      mixpanel.track(trackingEventName, analyticsData)
    }

    return next(action)
  }
}
