import orm from 'store/models' // this initializes redux-orm
import ormReducer from './index'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import {
  CREATE_MESSAGE,
  DELETE_COMMENT_PENDING,
  DELETE_POST_PENDING,
  FETCH_FOR_GROUP_PENDING,
  FETCH_NOTIFICATIONS,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING,
  TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_POST_PENDING,
  REACT_ON_POST_PENDING,
  REMOVE_POST_PENDING
} from 'store/constants'
import {
  PIN_POST_PENDING
} from 'components/PostCard/PostHeader/PostHeader.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING,
  UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'
import {
  UPDATE_GROUP_SETTINGS_PENDING
} from 'routes/GroupSettings/GroupSettings.store'
import {
  CREATE_GROUP
} from 'components/CreateGroup/CreateGroup.store'
import {
  REMOVE_MEMBER_PENDING
} from 'routes/Members/Members.store'
import {
  DELETE_GROUP_TOPIC_PENDING
} from 'routes/AllTopics/AllTopics.store'

import deep from 'deep-diff'

it('responds to an action with meta.extractModel', () => {
  const state = orm.getEmptyState()

  const action = {
    type: 'whatever',
    payload: {
      data: {
        post: {
          id: '1',
          title: 'Cat on the loose',
          groups: [
            {
              id: '1',
              name: 'Neighborhood'
            }
          ],
          creator: {
            id: '2',
            name: 'Greg'
          }
        }
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }

  const newState = ormReducer(state, action)

  expect(newState).toMatchObject({
    Group: {
      items: ['1'],
      itemsById: { '1': { id: '1', name: 'Neighborhood' } }
    },
    Person: {
      items: ['2'],
      itemsById: { '2': { id: '2', name: 'Greg' } }
    },
    Post: {
      items: ['1'],
      itemsById: { '1': { id: '1', title: 'Cat on the loose', creator: '2' } }
    },
    PostGroups: {
      items: [0],
      itemsById: { '0': { fromPostId: '1', toGroupId: '1', id: 0 } }
    }
  })
})

it('ignores an action with meta.extractModel that is a promise', () => {
  const state = orm.getEmptyState()

  const action = {
    type: 'FOO',
    payload: new Promise(() => {}),
    meta: {
      extractModel: 'Post'
    }
  }

  const newState = ormReducer(state, action)
  expect(newState).toEqual(state)
})

describe('on REACT_ON_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  session.Post.create({ id: '1', myReactions: [], postReactions: [] })
  session.Me.create({ id: '1', name: 'Mary' })

  const state = session.state

  const action = {
    type: REACT_ON_POST_PENDING
  }

  describe('when someone reacts to a post', () => {
    it('optimistically updates state', () => {
      const newState = ormReducer(state, { ...action, meta: { postId: '1', data: { emojiFull: '\uD83D\uDC4D' } } })
      const newSession = orm.session(newState)
      expect(newSession.Post.withId('1').myReactions[0].emojiFull).toEqual('\uD83D\uDC4D')
      expect(newSession.Post.withId('1').postReactions[0].emojiFull).toEqual('\uD83D\uDC4D')
      expect(newSession.Post.withId('1').postReactions[0].user.name).toEqual('Mary')
    })
  })
})

const makeActivityState = () => {
  const session = orm.session(orm.getEmptyState())

  session.Activity.create({ id: '1', unread: true })
  session.Activity.create({ id: '2', unread: true })

  return session.state
}

describe('on MARK_ACTIVITY_READ_PENDING', () => {
  it('marks the activity read', () => {
    const state = makeActivityState()
    const action = {
      type: MARK_ACTIVITY_READ_PENDING,
      meta: {
        id: '2'
      }
    }
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})

describe('on MARK_ALL_ACTIVITIES_READ_PENDING', () => {
  it('marks the activity read', () => {
    const state = makeActivityState()
    const action = {
      type: MARK_ALL_ACTIVITIES_READ_PENDING
    }

    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})

describe('on TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING', () => {
  it('will set isSubscribed to false and decrement followersTotal', () => {
    const session = orm.session(orm.getEmptyState())
    session.Topic.create({ id: '2' })
    session.Group.create({ id: '3' })
    const groupTopic = session.GroupTopic.create({
      id: '1',
      topic: '2',
      group: '3',
      followersTotal: 10,
      isSubscribed: true
    })
    const state = session.state
    const action = {
      ...toggleGroupTopicSubscribe(groupTopic),
      type: TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING
    }
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })

  it('will set isSubscribed to true and increment followersTotal', () => {
    const session = orm.session(orm.getEmptyState())
    session.Topic.create({ id: '2' })
    session.Group.create({ id: '3' })
    const groupTopic = session.GroupTopic.create({
      id: '1',
      topic: '2',
      group: '3',
      followersTotal: 10
    })
    const state = session.state
    const action = {
      ...toggleGroupTopicSubscribe(groupTopic),
      type: TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING
    }
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})

describe('on CREATE_MESSAGE', () => {
  const session = orm.session(orm.getEmptyState())
  session.Message.create({ id: 'temp' })
  session.MessageThread.create({ id: '1' })

  // this would be created by extractModelMiddleware
  session.Message.create({ id: '2' })

  it('replaces the temporary message with a permanent one', () => {
    const action = {
      type: CREATE_MESSAGE,
      payload: {
        data: {
          createMessage: {
            messageThread: {
              id: '1'
            },
            id: '2',
            text: 'hi'
          }
        }
      },
      meta: { tempId: 'temp' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.Message.idExists('temp')).toBeFalsy()
    expect(newSession.Message.idExists('2')).toBeTruthy()
    const thread = newSession.MessageThread.withId('1')
    expect(Date.now() - new Date(thread.updatedAt).getTime()).toBeLessThan(1000)
  })
})

describe('on DELETE_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.Post.create({ id: '1' })
  session.Post.create({ id: '2' })
  session.Post.create({ id: '3' })

  it('removes the post', () => {
    const action = {
      type: DELETE_POST_PENDING,
      meta: { id: '2' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.Post.idExists('2')).toBeFalsy()
    expect(newSession.Post.idExists('1')).toBeTruthy()
  })
})

describe('on REMOVE_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const group1 = session.Group.create({ id: '1', slug: 'foo' })
  const group2 = session.Group.create({ id: '2', slug: 'bar' })

  session.Post.create({ id: '1', groups: [group1, group2] })
  session.Post.create({ id: '2', groups: [group1, group2] })

  it('removes the post from the group', () => {
    const action = {
      type: REMOVE_POST_PENDING,
      meta: { postId: '1', slug: 'bar' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const post1Groups = newSession.Post.withId('1').groups.toModelArray()

    expect(post1Groups.length).toEqual(1)
    expect(post1Groups[0].id).toEqual('1')
    expect(newSession.Post.withId('2').groups.toModelArray().length).toEqual(2)
  })
})

describe('on PIN_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '1', slug: 'foo' })
  const postId = 123
  const postMembership = session.PostMembership.create({
    pinned: false,
    group: group
  })

  session.Post.create({
    id: postId,
    groups: [group],
    postMemberships: [postMembership]
  })

  const action = {
    type: PIN_POST_PENDING,
    meta: {
      postId,
      groupId: group.id
    }
  }

  it('updates the postMembership', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const postMembership = newSession.Post.withId(postId).postMemberships.toModelArray()[0]
    expect(postMembership.pinned).toEqual(true)
  })
})

describe('on UPDATE_GROUP_SETTINGS_PENDING', () => {
  const id = '1'
  const session = orm.session(orm.getEmptyState())
  const me = session.Me.create({ id: '1' })
  const group = session.Group.create({
    id,
    name: 'Old Name',
    description: 'Old description'
  })
  session.Membership.create({
    group: group.id,
    person: me.id,
    settings: {
      sendFoo: true,
      sendEmail: false
    }
  })

  it('updates the group settings', () => {
    const name = 'New Name'
    const description = 'New description'
    const action = {
      type: UPDATE_GROUP_SETTINGS_PENDING,
      meta: {
        id,
        changes: {
          name,
          description
        }
      }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const group = newSession.Group.withId(id)
    expect(group.name).toEqual(name)
    expect(group.description).toEqual(description)
  })
})

describe('on FETCH_NOTIFICATIONS', () => {
  const session = orm.session(orm.getEmptyState())

  session.Me.create({ newNotificationCount: 3 })

  const action = {
    type: FETCH_NOTIFICATIONS,
    meta: {
      resetCount: true
    }
  }

  it('resets new notification count', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    expect(newSession.Me.first().newNotificationCount).toEqual(0)
  })
})

describe(' on UPDATE_MEMBERSHIP_SETTINGS_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({ id: 1 })
  const groupId = 3

  session.Membership.create({
    group: groupId,
    person: 1,
    settings: {
      sendFoo: true,
      sendEmail: false
    }
  })

  const action = {
    type: UPDATE_MEMBERSHIP_SETTINGS_PENDING,
    meta: {
      groupId,
      settings: {
        sendEmail: true,
        sendPushNotifications: false
      }
    }
  }

  it('updates membership settings, keeping current settings where unchanged', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const membership = newSession.Membership.safeGet({ group: groupId })
    expect(membership.settings).toEqual({
      sendFoo: true,
      sendEmail: true,
      sendPushNotifications: false
    })
  })
})

describe('on UPDATE_USER_SETTINGS_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  session.Me.create({
    location: 'original location',
    tagline: 'old tagline',
    settings: {
      digestFrequency: 'weekly',
      dmNotifications: 'both'
    }
  })

  const action = {
    type: UPDATE_USER_SETTINGS_PENDING,
    meta: {
      changes: {
        tagline: 'new tagline',
        settings: {
          digestFrequency: 'daily',
          commentNotifications: 'email',
          postNotifications: 'important'
        }
      }
    }
  }

  it('updates user, keeping current settings where unchanged', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const me = newSession.Me.first()
    expect(me.location).toEqual('original location')
    expect(me.tagline).toEqual('new tagline')
    expect(me.settings).toEqual({
      digestFrequency: 'daily',
      dmNotifications: 'both',
      commentNotifications: 'email',
      postNotifications: 'important'
    })
  })
})

describe('on FETCH_FOR_GROUP_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const me = session.Me.create({ id: '1' })

  const group = session.Group.create({
    id: '1',
    slug: 'foo'
  })

  session.Membership.create({
    id: '2',
    newPostCount: 99,
    group,
    person: me.id
  })

  const action = {
    type: FETCH_FOR_GROUP_PENDING,
    meta: {
      slug: group.slug
    }
  }

  it('clears newPostCount', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const membership = newSession.Membership.withId('2')
    expect(membership.newPostCount).toEqual(0)
  })
})

describe('on DELETE_COMMENT_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  session.Comment.create({
    id: '1'
  })
  session.Comment.create({
    id: '2'
  })

  const action = {
    type: DELETE_COMMENT_PENDING,
    meta: {
      id: '1'
    }
  }

  it('clears newPostCount', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const comments = newSession.Comment.all().toModelArray()
    expect(comments.length).toEqual(1)
    expect(comments[0].id).toEqual('2')
  })
})

describe('on UPDATE_POST_PENDING', () => {
  const postId = '123'
  const session = orm.session(orm.getEmptyState())

  session.Attachment.create({
    id: '1',
    post: postId
  })

  session.Attachment.create({
    id: '1',
    post: postId
  })

  session.Post.create({
    id: postId
  })

  const action = {
    type: UPDATE_POST_PENDING,
    meta: {
      id: postId
    }
  }

  it('removes attachments', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const attachments = newSession.Post.withId(postId).attachments.toModelArray()
    expect(attachments.length).toEqual(0)
  })
})

describe('on CREATE_GROUP', () => {
  const session = orm.session(orm.getEmptyState())
  const group1 = session.Group.create({ id: 'c1' })
  const group2 = session.Group.create({ id: 'c2' })
  const membership = session.Membership.create({ id: 'm1', group: group1.id })
  session.CommonRole.create({ id: 1, name: 'Coordinator', responsibilities: [{ id: 1, name: 'Administration' }] })
  session.Membership.create({ id: 'm2', group: group2.id })
  session.Me.create({
    id: 1,
    memberships: [membership.id],
    membershipCommonRoles: [{ commonRoleId: 1, groupId: group1.id, userId: 1, id: 1 }]
  })
  const action = {
    type: CREATE_GROUP,
    payload: {
      data: {
        createGroup: {
          id: 'g2',
          memberships: {
            items: [
              {
                id: 'm2'
              }
            ]
          },
          membershipCommonRoles: {
            items: [
              {
                id: 2,
                groupId: 'g2',
                commonRoleId: 1,
                userId: 1
              }
            ]
          }
        }
      }
    }
  }

  it('adds a membership to the currentUser with Coordinator role', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const currentUser = newSession.Me.first()
    expect(currentUser.memberships.toModelArray().length).toEqual(2)
    expect(currentUser.membershipCommonRoles.toRefArray()[0].commonRoleId).toEqual(1)
  })
})

describe('on REMOVE_MEMBER_PENDING', () => {
  it('decrements the member count and removes the member', () => {
    const action = {
      type: REMOVE_MEMBER_PENDING,
      meta: {
        groupId: '3',
        personId: '4'
      }
    }
    const session = orm.session(orm.getEmptyState())
    session.Person.create({ id: '2', name: 'Foo' })
    session.Person.create({ id: '4', name: 'Bar' })
    session.Group.create({ id: '3', memberCount: 8, members: ['2', '4'] })

    const newState = ormReducer(session.state, action)
    const group = orm.session(newState).Group.withId('3')
    expect(group.memberCount).toBe(7)
    const members = group.members.toRefArray()
    expect(members.length).toBe(1)
    expect(members[0].name).toBe('Foo')
  })
})

describe('on DELETE_GROUP_TOPIC_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.GroupTopic.create({ id: '1' })
  session.GroupTopic.create({ id: '2' })

  it('removes the GroupTopic', () => {
    const action = {
      type: DELETE_GROUP_TOPIC_PENDING,
      meta: { id: '1' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.GroupTopic.idExists('1')).toBeFalsy()
    expect(newSession.GroupTopic.idExists('2')).toBeTruthy()
  })
})

describe('on UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING', () => {
  it('should update all the memberships settings', () => {
    const session = orm.mutableSession(orm.getEmptyState())
    const meId = 'meId'
    session.Me.create({ id: meId })
    session.Membership.create({ person: meId, settings: {} })
    session.Membership.create({ person: meId, settings: {} })
    session.Membership.create({ person: meId, settings: {} })

    const action = {
      type: UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING,
      meta: {
        settings: {
          sendEmail: true
        }
      }
    }

    const newSession = orm.session(ormReducer(session.state, action))
    const membershipsAfterAction = newSession.Membership.all().toModelArray()
    membershipsAfterAction.map(membership => {
      expect(membership.settings.sendEmail).toEqual(true)
    })
  })
})

describe('on UPDATE_COMMENT_PENDING', () => {
  const commentId = '123'
  const session = orm.session(orm.getEmptyState())
  const theNewText = 'lalala'

  session.Comment.create({
    id: commentId,
    text: 'ufufuf'
  })

  const action = {
    type: UPDATE_COMMENT_PENDING,
    meta: {
      id: commentId,
      data: {
        text: theNewText
      }
    }
  }

  it('updates the text', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const comment = newSession.Comment.withId(commentId)
    expect(comment.text).toEqual(theNewText)
  })
})
