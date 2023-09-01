import { FETCH_NOTIFICATION_SETTINGS } from 'store/constants'

export default function fetchNoticationSettings (token) {
  return {
    type: FETCH_NOTIFICATION_SETTINGS,
    payload: {
      api: {
        path: '/noo/user/notification-settings',
        method: 'GET',
        params: { token }
      }
    }
  }
}
