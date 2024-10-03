import {
  ormSessionReducer,
  RECEIVE_MESSAGE,
  RECEIVE_POST,
  RECEIVE_NOTIFICATION
} from './SocketListener.store'
import orm from 'store/models'

describe('SocketListener.store.ormSessionReducer', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
  })

  it('responds to RECEIVE_MESSAGE', () => {
    const action = {
      type: RECEIVE_MESSAGE,
      payload: {
        data: {
          message: {
            text: 'hello world',
            messageThread: '7'
          }
        }
      },
      meta: {
        bumpUnreadCount: true
      }
    }

    ormSessionReducer(session, action)
    const thread = session.MessageThread.withId('7')
    expect(thread.unreadCount).toBe(1)
  })

  describe('for RECEIVE_POST', () => {
    let action

    beforeEach(() => {
      session.Me.create({ id: '2' })
      session.Person.create({ id: '14' })
      session.Group.create({ id: '1', name: 'place' })
      session.Membership.create({ id: '1', group: '1' })
      session.Membership.create({ id: '2', group: '1', person: '14' })
      session.GroupTopic.create({ id: '1', topic: '2', group: '1' })
      session.GroupTopic.create({ id: '2', topic: '7', group: '1' })
      action = {
        type: RECEIVE_POST,
        payload: {
          data: {
            post: {
              topics: ['2', '7'],
              groupId: '1',
              creatorId: '4'
            }
          }
        }
      }
    })

    it('updates new post counts', () => {
      ormSessionReducer(session, action)
      expect(session.Membership.withId('1').newPostCount).toBe(1)
      expect(session.Membership.withId('2').newPostCount).toBeFalsy()
      expect(session.GroupTopic.withId('1').newPostCount).toBe(1)
      expect(session.GroupTopic.withId('2').newPostCount).toBe(1)
    })

    it('ignores posts created by the current user', () => {
      action.payload.data.post.creatorId = '2'
      ormSessionReducer(session, action)
      expect(session.Membership.withId('1').newPostCount).toBeFalsy()
    })
  })

  it('responds to RECEIVE_NOTIFICATION', () => {
    session.Me.create({ id: '77', newNotificationCount: 2 })
    const action = {
      type: RECEIVE_NOTIFICATION
    }
    ormSessionReducer(session, action)
    expect(session.Me.first().newNotificationCount).toBe(3)
  })
})
