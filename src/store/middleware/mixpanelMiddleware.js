import { get, isString, isObject, omit } from 'lodash/fp'
import mixpanel from 'mixpanel-browser'
import { getAuthenticated } from '../selectors/getAuthState'
import getMe from '../selectors/getMe'
import { isDev } from 'config'

export default function mixpanelMiddleware (store) {
  return next => action => {
    const { type, meta } = action

    if (!type.match(/_PENDING$/) && meta && meta.analytics) {
      // meta.analytics can be either simply true, a string (name of event) or a hash
      // with data that will be attached to the event sent to mixpanel (eventName being
      // a required key).
      const state = store.getState()

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
