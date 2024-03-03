import {
  FETCH_NOTIFICATIONS,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING
} from 'store/constants'

export function handleNotificationActions (session, action) {
  const { type, meta, error } = action
  if (error) return

  const { Me, Activity } = session

  switch (type) {
    case FETCH_NOTIFICATIONS:
      if (meta.resetCount) {
        const me = Me.first()
        me && me.update({ newNotificationCount: 0 })
        if (window.electron) {
          window.electron.setBadgeCount(0)
        }
      }
      break

    case MARK_ACTIVITY_READ_PENDING:
      Activity.withId(meta.id).update({ unread: false })
      // invalidating selector memoization
      invalidateNotifications(session)
      break

    case MARK_ALL_ACTIVITIES_READ_PENDING:
      Activity.all().update({ unread: false })
      // invalidating selector memoization
      invalidateNotifications(session)
      break
  }
}

function invalidateNotifications ({ Notification }) {
  const first = Notification.first()
  first && first.update({ time: Date.now() })
}
