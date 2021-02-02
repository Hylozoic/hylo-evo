import * as sessionReducers from './sessionReducers'
import {
  ADD_MODERATOR_PENDING,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  DELETE_COMMENT_PENDING,
  FETCH_MESSAGES_PENDING,
  JOIN_PROJECT_PENDING,
  LEAVE_GROUP,
  LEAVE_PROJECT_PENDING,
  PROCESS_STRIPE_TOKEN_PENDING,
  REMOVE_MODERATOR_PENDING,
  RESET_NEW_POST_COUNT_PENDING,
  RESPOND_TO_EVENT_PENDING,
  TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_GROUP_TOPIC_PENDING,
  UPDATE_POST_PENDING,
  UPDATE_THREAD_READ_TIME,
  UPDATE_USER_SETTINGS_PENDING as UPDATE_USER_SETTINGS_GLOBAL_PENDING,
  VOTE_ON_POST_PENDING
} from 'store/constants'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING,
  UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'

// FIXME these should not be using different constants and getting handled in
// different places -- they're doing the same thing!
import {
  REMOVE_SKILL_PENDING, ADD_SKILL
} from 'components/SkillsSection/SkillsSection.store'
import {
  REMOVE_SKILL_PENDING as REMOVE_SKILL_TO_LEARN_PENDING, ADD_SKILL as ADD_SKILL_TO_LEARN
} from 'components/SkillsToLearnSection/SkillsToLearnSection.store'
import {
  SIGNUP_ADD_SKILL, SIGNUP_REMOVE_SKILL_PENDING
} from 'routes/Signup/AddSkills/AddSkills.store'

import {
  UPDATE_GROUP_SETTINGS_PENDING
} from 'routes/GroupSettings/GroupSettings.store'
import {
  CREATE_GROUP
} from 'routes/CreateGroup/Review/Review.store'
import {
  USE_INVITATION
} from 'routes/JoinGroup/JoinGroup.store'

import {
  DELETE_GROUP_TOPIC_PENDING
} from 'routes/AllTopics/AllTopics.store'
import {
  INVITE_PEOPLE_TO_EVENT_PENDING
} from 'components/EventInviteDialog/EventInviteDialog.store'

import orm from 'store/models'
import clearCacheFor from './clearCacheFor'
import { find, values } from 'lodash/fp'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const {
    Comment,
    Group,
    GroupTopic,
    EventInvitation,
    Me,
    Membership,
    Message,
    MessageThread,
    Person,
    Post,
    PostCommenter,
    ProjectMember,
    Skill
  } = session

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  let me, membership, group, person, post, comment, groupTopic

  switch (type) {
    case CREATE_COMMENT_PENDING:
      Comment.create({
        id: meta.tempId,
        post: meta.postId,
        text: meta.text,
        creator: Me.first().id })
      break

    case CREATE_COMMENT:
      Comment.withId(meta.tempId).delete()
      if (!PostCommenter.safeGet({ post: meta.postId, commenter: Me.first().id })) {
        PostCommenter.create({ post: meta.postId, commenter: Me.first().id })
        // we can assume the following because the backend returns the results pre-sorted
        // with the currentUser at the beginning
        const p = Post.withId(meta.postId)
        p.update({ commentersTotal: p.commentersTotal + 1 })
      }
      break

    case CREATE_MESSAGE_PENDING:
      Message.create({
        id: meta.tempId,
        messageThread: meta.messageThreadId,
        text: meta.text,
        createdAt: new Date().toString(),
        creator: Me.first().id })
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
        Message.filter({ messageThread: meta.id }).delete()
      }
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).markAsRead()
      break

    case LEAVE_GROUP:
      me = Me.first()
      membership = find(m => m.group.id === meta.id, me.memberships.toModelArray())
      if (membership) membership.delete()
      break

    case TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING:
      groupTopic = GroupTopic.get({ topic: meta.topicId, group: meta.groupId })
      groupTopic.update({
        followersTotal: groupTopic.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break

    case UPDATE_GROUP_TOPIC_PENDING:
      groupTopic = GroupTopic.withId(meta.id)
      groupTopic.update(meta.data)
      clearCacheFor(GroupTopic, meta.id)
      break

    case VOTE_ON_POST_PENDING:
      post = session.Post.withId(meta.postId)
      if (post.myVote) {
        !meta.isUpvote && post.update({ myVote: false, votesTotal: (post.votesTotal || 1) - 1 })
      } else {
        meta.isUpvote && post.update({ myVote: true, votesTotal: (post.votesTotal || 0) + 1 })
      }
      break

    case RESET_NEW_POST_COUNT_PENDING:
      if (meta.type === 'GroupTopic') {
        session.GroupTopic.withId(meta.id).update({ newPostCount: 0 })
      } else if (meta.type === 'Membership') {
        me = Me.first()
        const membership = Membership.safeGet({ group: meta.id, person: me.id })
        membership && membership.update({ newPostCount: 0 })
      }
      break

    case ADD_MODERATOR_PENDING:
      person = Person.withId(meta.personId)
      Group.withId(meta.groupId).updateAppending({ moderators: [person] })
      break

    case REMOVE_MODERATOR_PENDING:
      group = Group.withId(meta.groupId)
      const moderators = group.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      group.update({ moderators })
      break

    case UPDATE_GROUP_SETTINGS_PENDING:
      group = Group.withId(meta.id)
      group.update(meta.changes)
      me = Me.first()

      // Triggers an update to redux-orm for the membership
      membership = Membership.safeGet({ group: meta.id, person: me.id }).update({ forceUpdate: new Date() })
      break

    case UPDATE_MEMBERSHIP_SETTINGS_PENDING:
      me = Me.first()
      membership = Membership.safeGet({ group: meta.groupId, person: me.id })

      if (!membership) break
      membership.update({
        settings: {
          ...membership.settings,
          ...meta.settings
        }
      })
      break

    case UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING:
      const memberships = session.Membership.all()
      memberships.toModelArray().map(membership => {
        membership.update({
          settings: {
            ...membership.settings,
            ...meta.settings
          }
        })
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

    case REMOVE_SKILL_TO_LEARN_PENDING:
      person = Person.withId(Me.first().id)
      person.skillsToLearn.remove(meta.skillId)
      break

    case SIGNUP_REMOVE_SKILL_PENDING:
      me = Me.withId(Me.first().id)
      me.skills.remove(meta.skillId)
      break

    case ADD_SKILL:
      const skill = payload.data.addSkill
      person = Person.withId(Me.first().id)
      person.updateAppending({ skills: [Skill.create(skill)] })
      break

    case ADD_SKILL_TO_LEARN:
      const skillToLearn = payload.data.addSkillToLearn
      person = Person.withId(Me.first().id)
      person.updateAppending({ skillsToLearn: [Skill.create(skillToLearn)] })
      break

    case SIGNUP_ADD_SKILL:
      const mySkill = payload.data.addSkill
      me = Me.withId(Me.first().id)
      me.updateAppending({ skills: [Skill.create(mySkill)] })
      break

    case DELETE_COMMENT_PENDING:
      comment = Comment.withId(meta.id)
      comment.delete()
      break

    case UPDATE_POST_PENDING:
      // deleting all attachments and removing topics here because we restore them from the result of the UPDATE_POST action
      post = Post.withId(meta.id)
      post.attachments.toModelArray().map(a => a.delete())
      post.update({ topics: [] })
      break

    case CREATE_GROUP:
      me = Me.withId(Me.first().id)
      me.updateAppending({ memberships: [payload.data.createGroup.id] })
      break

    case JOIN_PROJECT_PENDING:
      me = Me.first()
      ProjectMember.create({ post: meta.id, member: me.id })
      clearCacheFor(Post, meta.id)
      break

    case LEAVE_PROJECT_PENDING:
      me = Me.first()
      const projectMember = find(
        m => String(m.member.id) === String(me.id) && String(m.post.id) === String(meta.id),
        ProjectMember.all().toModelArray()
      )
      if (projectMember) {
        projectMember.delete()
        clearCacheFor(Post, meta.id)
      }
      break

    case USE_INVITATION:
      Me.first().updateAppending({ memberships: [payload.data.useInvitation.membership.id] })
      break

    case DELETE_GROUP_TOPIC_PENDING:
      groupTopic = GroupTopic.withId(meta.id)
      groupTopic.delete()
      break

    case UPDATE_COMMENT_PENDING:
      comment = Comment.withId(meta.id)
      comment.update(meta.data)
      break

    case PROCESS_STRIPE_TOKEN_PENDING:
      post = Post.withId(meta.postId)
      const totalContributions = Number(post.totalContributions) + Number(meta.amount)
      post.update({
        totalContributions
      })
      break

    case RESPOND_TO_EVENT_PENDING:
      const event = Post.withId(meta.id)
      event.update({ myEventResponse: meta.response })
      break

    case INVITE_PEOPLE_TO_EVENT_PENDING:
      meta.inviteeIds.map(inviteeId => {
        EventInvitation.create({
          event: meta.eventId,
          person: inviteeId
        })
      })
      clearCacheFor(Post, meta.eventId)
      break
  }

  values(sessionReducers).forEach(fn => fn(session, action))
  return session.state
}
