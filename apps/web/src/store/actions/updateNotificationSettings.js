import { UPDATE_NOTIFICATION_SETTINGS } from 'store/constants'

export default function updateNoticationSettings (token, unsubscribeAll, digestFrequency, dmNotifications, commentNotifications, postNotifications, allGroupNotifications) {
  return {
    type: UPDATE_NOTIFICATION_SETTINGS,
    payload: {
      api: {
        path: '/noo/user/update-notification-settings',
        method: 'POST',
        params: { token, unsubscribeAll, digestFrequency, dmNotifications, commentNotifications, postNotifications, allGroupNotifications }
      }
    }
  }
}
