import { get, isString, isObject, omit } from 'lodash/fp'

export default function mixpanelMiddleware (store) {
  return next => action => {
    const { type, meta } = action
    if (!type.match(/_PENDING$/) && meta && meta.analytics) {
      // meta.analytics can be either simply true, a string (name of event) or a hash 
      // with data that will be attached to the event sent to mixpanel (eventName being
      // a required key).
      // 
      // NOTE: the mixpanel object is initialized in initialState of the store creation
      const { analytics } = meta
      const trackingEventName = get('eventName', analytics) ||
        (isString(analytics) && analytics) ||
        type
      const analyticsData = isObject(analytics) ? omit('eventName', analytics) : null
      const mixpanel = store.getState().mixpanel
      mixpanel.track(trackingEventName, analyticsData)
    }
    return next(action)
  }
}
