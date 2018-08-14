import mixpanel from 'mixpanel-browser'
import { TRACK_ANALYTICS_EVENT } from 'store/constants'

export default function trackAnalyticsEvent (eventName, data) {
  return {
    type: TRACK_ANALYTICS_EVENT,
    meta: {
      analytics: {
        eventName: eventName,
        ...data
      }
    }
  }
}
