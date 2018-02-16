import * as sessionReducers from './sessionReducers'
import {
  ADD_MODERATOR_PENDING,
  REMOVE_MODERATOR_PENDING,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  FETCH_MESSAGES_PENDING,
  LEAVE_COMMUNITY,
  RESET_NEW_POST_COUNT_PENDING,
  TOGGLE_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_THREAD_READ_TIME,
  VOTE_ON_POST_PENDING,
  UPDATE_USER_SETTINGS_PENDING as UPDATE_USER_SETTINGS_GLOBAL_PENDING
} from 'store/constants'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'

// FIXME these should not be using different constants and getting handled in
// different places -- they're doing the same thing!
import {
  REMOVE_SKILL_PENDING, ADD_SKILL
} from 'components/SkillsSection/SkillsSection.store'
import {
  SIGNUP_ADD_SKILL, SIGNUP_REMOVE_SKILL_PENDING
} from 'routes/Signup/AddSkills/AddSkills.store'

import {
  UPDATE_COMMUNITY_SETTINGS_PENDING
} from 'routes/CommunitySettings/CommunitySettings.store'
import {
  DELETE_COMMENT_PENDING
} from 'routes/PostDetail/Comments/Comment/Comment.store'
import {
  UPDATE_POST_PENDING
} from 'components/PostEditor/PostEditor.store'
import {
  CREATE_COMMUNITY
} from 'routes/CreateCommunity/Review/Review.store'
import {
  USE_INVITATION
} from 'routes/JoinCommunity/JoinCommunity.store'

import orm from 'store/models'
import { find, values } from 'lodash/fp'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const {
    Comment,
    Community,
    CommunityTopic,
    Me,
    Membership,
    Message,
    MessageThread,
    Person,
    Post,
    PostCommenter,
    Skill
  } = session

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  let me, membership, community, person, post

  switch (type) {
    case CREATE_COMMENT_PENDING:
      Comment.create({
        id: meta.tempId,
        post: meta.postId,
        text: meta.text,
        creator: Me.first().id})
      break

    case CREATE_COMMENT:
      Comment.withId(meta.tempId).delete()
      if (!PostCommenter.safeGet({post: meta.postId, commenter: Me.first().id})) {
        PostCommenter.create({post: meta.postId, commenter: Me.first().id})
        // we can assume the following because the backend returns the results pre-sorted
        // with the currentUser at the beginning
        const p = Post.withId(meta.postId)
        p.update({commentersTotal: p.commentersTotal + 1})
      }
      break

    case CREATE_MESSAGE_PENDING:
      Message.create({
        id: meta.tempId,
        messageThread: meta.messageThreadId,
        text: meta.text,
        createdAt: new Date().toString(),
        creator: Me.first().id})
      break

    case CREATE_MESSAGE:
      Message.withId(meta.tempId).delete()
      const message = payload.data.createMessage
      MessageThread.withId(message.messageThread.id).newMessageReceived()
      break

    case FETCH_MESSAGES_PENDING:
      if (meta.reset) {
        // this is so that after websocket reconnect events, pagination
        // of messages works as expected
        Message.filter({messageThread: meta.id}).delete()
      }
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).markAsRead()
      break

    case LEAVE_COMMUNITY:
      me = Me.first()
      membership = find(m => m.community.id === meta.id, me.memberships.toModelArray())
      if (membership) membership.delete()
      break

    case TOGGLE_TOPIC_SUBSCRIBE_PENDING:
      const ct = CommunityTopic.get({topic: meta.topicId, community: meta.communityId})
      ct.update({
        followersTotal: ct.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break

    case VOTE_ON_POST_PENDING:
      post = session.Post.withId(meta.postId)
      if (post.myVote) {
        !meta.isUpvote && post.update({myVote: false, votesTotal: (post.votesTotal || 1) - 1})
      } else {
        meta.isUpvote && post.update({myVote: true, votesTotal: (post.votesTotal || 0) + 1})
      }
      break

    case RESET_NEW_POST_COUNT_PENDING:
      if (meta.type === 'CommunityTopic') {
        session.CommunityTopic.withId(meta.id).update({newPostCount: 0})
      } else if (meta.type === 'Membership') {
        const membership = session.Membership.safeGet({community: meta.id})
        membership && membership.update({newPostCount: 0})
      }
      break

    case ADD_MODERATOR_PENDING:
      person = Person.withId(meta.personId)
      Community.withId(meta.communityId).updateAppending({moderators: [person]})
      break

    case REMOVE_MODERATOR_PENDING:
      community = Community.withId(meta.communityId)
      const moderators = community.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      community.update({moderators})
      break

    case UPDATE_COMMUNITY_SETTINGS_PENDING:
      community = Community.withId(meta.id)
      community.update(meta.changes)
      break

    case UPDATE_MEMBERSHIP_SETTINGS_PENDING:
      membership = Membership.safeGet({community: meta.communityId})
      if (!membership) break
      membership.update({
        settings: {
          ...membership.settings,
          ...meta.settings
        }
      })
      break

    case UPDATE_USER_SETTINGS_PENDING:
    case UPDATE_USER_SETTINGS_GLOBAL_PENDING:
      me = Me.first()
      const changes = {
        ...meta.changes,
        settings: {
          ...me.settings,
          ...meta.changes.settings
        }
      }
      me.update(changes)
      break

    case REMOVE_SKILL_PENDING:
      person = Person.withId(Me.first().id)
      person.skills.remove(meta.skillId)
      break

    case SIGNUP_REMOVE_SKILL_PENDING:
      me = Me.withId(Me.first().id)
      me.skills.remove(meta.skillId)
      break

    case ADD_SKILL:
      const skill = payload.data.addSkill
      person = Person.withId(Me.first().id)
      person.updateAppending({skills: [Skill.create(skill)]})
      break

    case SIGNUP_ADD_SKILL:
      const mySkill = payload.data.addSkill
      me = Me.withId(Me.first().id)
      me.updateAppending({skills: [Skill.create(mySkill)]})
      break

    case DELETE_COMMENT_PENDING:
      const comment = Comment.withId(meta.id)
      comment.delete()
      break

    case UPDATE_POST_PENDING:
      // deleting all attachments here because we restore them from the result of the UPDATE_POST action
      post = Post.withId(meta.id)
      post.attachments.toModelArray().map(a => a.delete())
      break

    case CREATE_COMMUNITY:
      me = Me.withId(Me.first().id)
      me.updateAppending({memberships: [payload.data.createCommunity.id]})
      break

    case USE_INVITATION:
      Me.first().updateAppending({memberships: [payload.data.useInvitation.membership.id]})
      break
  }

  values(sessionReducers).forEach(fn => fn(session, action))
  return session.state
}
