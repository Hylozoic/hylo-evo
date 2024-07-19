import orm from '../../../../../store/models'
import { getNotifications } from './NotificationsDropdown.store'

describe('getNotifications', () => {
  it('returns expected values', () => {
    const session = orm.session(orm.getEmptyState())
    const notification1 = session.Notification.create({ id: 1 })
    const notification2 = session.Notification.create({ id: 2 })
    const notifications = getNotifications({ orm: session.state }, {})
    expect(notifications.length).toEqual(2)
    expect(notifications[0]).toEqual(notification2)
    expect(notifications[1]).toEqual(notification1)
  })
})
