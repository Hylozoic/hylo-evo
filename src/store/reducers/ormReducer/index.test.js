import orm from 'store/models' // this initializes redux-orm
import ormReducer from './index'
import toggleCommunityTopicSubscribe from 'store/actions/toggleCommunityTopicSubscribe'
import {
  CREATE_MESSAGE,
  DELETE_COMMENT_PENDING,
  FETCH_FOR_COMMUNITY_PENDING,
  FETCH_NOTIFICATIONS,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING,
  TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_POST_PENDING,
  VOTE_ON_POST_PENDING
} from 'store/constants'
import {
  DELETE_POST_PENDING,
  REMOVE_POST_PENDING,
  PIN_POST_PENDING
} from 'components/PostCard/PostHeader/PostHeader.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING,
  UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'
import {
  UPDATE_COMMUNITY_SETTINGS_PENDING
} from 'routes/CommunitySettings/CommunitySettings.store'
import {
  CREATE_COMMUNITY
} from 'routes/CreateCommunity/Review/Review.store'
import {
  REMOVE_MEMBER_PENDING
} from 'routes/Members/Members.store'
import {
  UPDATE_COMMUNITY_HIDDEN_SETTING_PENDING
} from 'routes/NetworkSettings/NetworkSettings.store'
import {
  DELETE_COMMUNITY_TOPIC_PENDING
} from 'routes/AllTopics/AllTopics.store'

import {
  REMOVE_SKILL_PENDING, ADD_SKILL
} from 'components/SkillsSection/SkillsSection.store'
import {
  REMOVE_SKILL_PENDING as REMOVE_SKILL_TO_LEARN_PENDING, ADD_SKILL as ADD_SKILL_TO_LEARN
} from 'components/SkillsToLearnSection/SkillsToLearnSection.store'
import {
  SIGNUP_ADD_SKILL, SIGNUP_REMOVE_SKILL_PENDING
} from 'routes/Signup/AddSkills/AddSkills.store'

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
          communities: [
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
    Community: {
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
    PostCommunities: {
      items: [0],
      itemsById: { '0': { fromPostId: '1', toCommunityId: '1', id: 0 } }
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

describe('on VOTE_ON_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  session.Post.create({ id: '1', votesTotal: 7, myVote: false })
  session.Post.create({ id: '2', votesTotal: 4, myVote: true })

  const state = session.state

  const action = {
    type: VOTE_ON_POST_PENDING
  }

  describe('when myVote is false', () => {
    it('does nothing if isUpvote is false', () => {
      expect(ormReducer(state, { ...action, meta: { postId: '1', isUpvote: false } }))
        .toEqual(state)
    })

    it('increments votesTotal and updates myVote if isUpvote is true', () => {
      const newState = ormReducer(state, { ...action, meta: { postId: '1', isUpvote: true } })
      expect(deep(state, newState)).toMatchSnapshot()
    })
  })

  describe('when myVote is true', () => {
    it('does nothing if isUpvote is true', () => {
      expect(ormReducer(state, { ...action, meta: { postId: '2', isUpvote: true } }))
        .toEqual(state)
    })

    it('decrements votesTotal and updates myVote if isUpvote is false', () => {
      const newState = ormReducer(state, { ...action, meta: { postId: '2', isUpvote: false } })
      expect(deep(state, newState)).toMatchSnapshot()
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

describe('on TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE_PENDING', () => {
  it('will set isSubscribed to false and decrement followersTotal', () => {
    const session = orm.session(orm.getEmptyState())
    session.Topic.create({ id: '2' })
    session.Community.create({ id: '3' })
    const communityTopic = session.CommunityTopic.create({
      id: '1',
      topic: '2',
      community: '3',
      followersTotal: 10,
      isSubscribed: true
    })
    const state = session.state
    const action = {
      ...toggleCommunityTopicSubscribe(communityTopic),
      type: TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE_PENDING
    }
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })

  it('will set isSubscribed to true and increment followersTotal', () => {
    const session = orm.session(orm.getEmptyState())
    session.Topic.create({ id: '2' })
    session.Community.create({ id: '3' })
    const communityTopic = session.CommunityTopic.create({
      id: '1',
      topic: '2',
      community: '3',
      followersTotal: 10
    })
    const state = session.state
    const action = {
      ...toggleCommunityTopicSubscribe(communityTopic),
      type: TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE_PENDING
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
  const community1 = session.Community.create({ id: '1', slug: 'foo' })
  const community2 = session.Community.create({ id: '2', slug: 'bar' })

  session.Post.create({ id: '1', communities: [community1, community2] })
  session.Post.create({ id: '2', communities: [community1, community2] })

  it('removes the post from the community', () => {
    const action = {
      type: REMOVE_POST_PENDING,
      meta: { postId: '1', slug: 'bar' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const post1Communities = newSession.Post.withId('1').communities.toModelArray()

    expect(post1Communities.length).toEqual(1)
    expect(post1Communities[0].id).toEqual('1')
    expect(newSession.Post.withId('2').communities.toModelArray().length).toEqual(2)
  })
})

describe('on PIN_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({ id: '1', slug: 'foo' })
  const postId = 123
  const postMembership = session.PostMembership.create({
    pinned: false,
    community: community
  })

  session.Post.create({
    id: postId,
    communities: [community],
    postMemberships: [postMembership]
  })

  const action = {
    type: PIN_POST_PENDING,
    meta: {
      postId,
      communityId: community.id
    }
  }

  it('updates the postMembership', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)

    const postMembership = newSession.Post.withId(postId).postMemberships.toModelArray()[0]
    expect(postMembership.pinned).toEqual(true)
  })
})

describe('on UPDATE_COMMUNITY_SETTINGS_PENDING', () => {
  const id = '1'
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({
    id,
    name: 'Old Name',
    description: 'Old description'
  })
  session.Membership.create({
    community: community.id,
    settings: {
      sendFoo: true,
      sendEmail: false
    }
  })

  it('updates the community settings', () => {
    const name = 'New Name'
    const description = 'New description'
    const action = {
      type: UPDATE_COMMUNITY_SETTINGS_PENDING,
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
    const community = newSession.Community.withId(id)
    expect(community.name).toEqual(name)
    expect(community.description).toEqual(description)
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
  const communityId = 3

  session.Membership.create({
    community: communityId,
    settings: {
      sendFoo: true,
      sendEmail: false
    }
  })

  const action = {
    type: UPDATE_MEMBERSHIP_SETTINGS_PENDING,
    meta: {
      communityId,
      settings: {
        sendEmail: true,
        sendPushNotifications: false
      }
    }
  }

  it('updates membership settings, keeping current settings where unchanged', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const membership = newSession.Membership.safeGet({ community: communityId })
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
          commentNotifications: 'email'
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
      commentNotifications: 'email'
    })
  })
})

describe('on FETCH_FOR_COMMUNITY_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  const community = session.Community.create({
    id: '1',
    slug: 'foo'
  })

  session.Membership.create({
    id: '2',
    newPostCount: 99,
    community
  })

  const action = {
    type: FETCH_FOR_COMMUNITY_PENDING,
    meta: {
      slug: community.slug
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

describe('on CREATE_COMMUNITY', () => {
  const session = orm.session(orm.getEmptyState())
  const community1 = session.Community.create({ id: 'c1' })
  const community2 = session.Community.create({ id: 'c2' })
  const hasModeratorRole = true
  const membership = session.Membership.create({ id: 'm1', community: community1.id, hasModeratorRole })
  session.Membership.create({ id: 'm2', community: community2.id, hasModeratorRole })
  session.Me.create({
    memberships: [membership.id]
  })
  const action = {
    type: CREATE_COMMUNITY,
    payload: {
      data: {
        createCommunity: {
          id: 'm2',
          hasModeratorRole: true,
          community: {
            id: 'c2'
          }
        }
      }
    }
  }

  it('adds a membership to the currentUser with hasModeratorRole', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const currentUser = newSession.Me.first()
    expect(currentUser.memberships.toModelArray().length).toEqual(2)
    expect(currentUser.memberships.toRefArray()[0].hasModeratorRole).toEqual(true)
  })
})

describe('on REMOVE_MEMBER_PENDING', () => {
  it('decrements the member count and removes the member', () => {
    const action = {
      type: REMOVE_MEMBER_PENDING,
      meta: {
        communityId: '3',
        personId: '4'
      }
    }
    const session = orm.session(orm.getEmptyState())
    session.Person.create({ id: '2', name: 'Foo' })
    session.Person.create({ id: '4', name: 'Bar' })
    session.Community.create({ id: '3', memberCount: 8, members: ['2', '4'] })

    const newState = ormReducer(session.state, action)
    const community = orm.session(newState).Community.withId('3')
    expect(community.memberCount).toBe(7)
    const members = community.members.toRefArray()
    expect(members.length).toBe(1)
    expect(members[0].name).toBe('Foo')
  })
})

describe('on UPDATE_COMMUNITY_HIDDEN_SETTING_PENDING', () => {
  it('sets the community.hidden property', () => {
    const communityId = 34
    const action = {
      type: UPDATE_COMMUNITY_HIDDEN_SETTING_PENDING,
      meta: {
        id: communityId,
        hidden: true
      }
    }
    const session = orm.session(orm.getEmptyState())
    session.Community.create({ id: communityId, hidden: false })

    const newState = ormReducer(session.state, action)
    const community = orm.session(newState).Community.withId(communityId)
    expect(community.hidden).toBe(true)
  })
})

describe('on DELETE_COMMUNITY_TOPIC_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  session.CommunityTopic.create({ id: '1' })
  session.CommunityTopic.create({ id: '2' })

  it('removes the communityTopic', () => {
    const action = {
      type: DELETE_COMMUNITY_TOPIC_PENDING,
      meta: { id: '1' }
    }
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    expect(newSession.CommunityTopic.idExists('1')).toBeFalsy()
    expect(newSession.CommunityTopic.idExists('2')).toBeTruthy()
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

describe('on ADD_SKILL', () => {
  const session = orm.session(orm.getEmptyState())
  const meId = 'meId'
  const me = session.Me.create({ id: meId })
  const person = session.Person.create({ id: meId })

  const action = {
    type: ADD_SKILL,
    payload: {
      data: {
        addSkill: {
          id: '1',
          name: 'Sneezing'
        }
      }
    }
  }

  it('adds the skill', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const person = newSession.Person.withId(meId)
    expect(person.skills.toModelArray().length).toEqual(1)
  })
})

describe('on SIGNUP_ADD_SKILL', () => {
  const session = orm.session(orm.getEmptyState())
  const me = session.Me.create({ id: 'meId' })

  const action = {
    type: SIGNUP_ADD_SKILL,
    payload: {
      data: {
        addSkill: {
          id: '1',
          name: 'Sneezing'
        }
      }
    }
  }

  it('adds the skill', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const me = newSession.Me.first()
    expect(me.skills.toModelArray().length).toEqual(1)
  })
})

describe('on ADD_SKILL_TO_LEARN', () => {
  const session = orm.session(orm.getEmptyState())
  const meId = 'meId'
  const me = session.Me.create({ id: meId })
  const person = session.Person.create({ id: meId })

  const action = {
    type: ADD_SKILL_TO_LEARN,
    payload: {
      data: {
        addSkillToLearn: {
          id: '1',
          name: 'Sneezing'
        }
      }
    }
  }

  it('adds the skill to learn', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const person = newSession.Person.withId(meId)
    expect(person.skillsToLearn.toModelArray().length).toEqual(1)
  })
})

describe('on REMOVE_SKILL_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const skill = session.Skill.create({ id: '1', name: 'Snowboarding' })
  const meId = 'meId'
  const me = session.Me.create({ id: meId })
  const person = session.Person.create({ id: meId, skills: [skill] })

  const action = {
    type: REMOVE_SKILL_PENDING,
    meta: {
      skillId: '1'
    }
  }

  it('removes the skill', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const person = newSession.Person.withId(meId)
    expect(person.skills.toModelArray().length).toEqual(0)
  })
})

describe('on REMOVE_SKILL_TO_LEARN_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const skill = session.Skill.create({ id: '1', name: 'Snowboarding' })
  const meId = 'meId'
  const me = session.Me.create({ id: meId })
  const person = session.Person.create({ id: meId, skillsToLearn: [skill] })

  const action = {
    type: REMOVE_SKILL_TO_LEARN_PENDING,
    meta: {
      skillId: '1'
    }
  }

  it('removes the skill to learn', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const person = newSession.Person.withId(meId)
    expect(person.skillsToLearn.toModelArray().length).toEqual(0)
  })
})

describe('on SIGNUP_REMOVE_SKILL_PENDING', () => {
  const session = orm.session(orm.getEmptyState())
  const skill = session.Skill.create({ id: '1', name: 'Snowboarding' })
  const me = session.Me.create({ id: 'meId', skills: [skill] })

  const action = {
    type: SIGNUP_REMOVE_SKILL_PENDING,
    meta: {
      skillId: '1'
    }
  }

  it('removes the skill', () => {
    const newState = ormReducer(session.state, action)
    const newSession = orm.session(newState)
    const me = newSession.Me.first()
    expect(me.skills.toModelArray().length).toEqual(0)
  })
})


