/* eslint-disable no-fallthrough */
import * as sessionReducers from './sessionReducers'
import {
  ACCEPT_GROUP_RELATIONSHIP_INVITE,
  ADD_PROPOSAL_VOTE_PENDING,
  CANCEL_GROUP_RELATIONSHIP_INVITE,
  CLEAR_MODERATION_ACTION_PENDING,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_JOIN_REQUEST,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  CREATE_MODERATION_ACTION_PENDING,
  DELETE_COMMENT_PENDING,
  DELETE_GROUP_RELATIONSHIP,
  DELETE_POST_PENDING,
  FETCH_GROUP_DETAILS_PENDING,
  FETCH_MESSAGES_PENDING,
  FETCH_POSTS_PENDING,
  INVITE_CHILD_TO_JOIN_PARENT_GROUP,
  JOIN_PROJECT_PENDING,
  LEAVE_GROUP,
  LEAVE_PROJECT_PENDING,
  PROCESS_STRIPE_TOKEN_PENDING,
  REACT_ON_POST_PENDING,
  REACT_ON_COMMENT_PENDING,
  RECORD_CLICKTHROUGH_PENDING,
  REJECT_GROUP_RELATIONSHIP_INVITE,
  REMOVE_REACT_ON_COMMENT_PENDING,
  REMOVE_REACT_ON_POST_PENDING,
  REMOVE_POST_PENDING,
  REMOVE_PROPOSAL_VOTE_PENDING,
  REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP,
  RESET_NEW_POST_COUNT_PENDING,
  RESPOND_TO_EVENT_PENDING,
  SWAP_PROPOSAL_VOTE_PENDING,
  TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_COMMENT_PENDING,
  UPDATE_GROUP_TOPIC_PENDING,
  UPDATE_POST,
  UPDATE_POST_PENDING,
  UPDATE_THREAD_READ_TIME,
  UPDATE_USER_SETTINGS_PENDING as UPDATE_USER_SETTINGS_GLOBAL_PENDING,
  UPDATE_WIDGET,
  USE_INVITATION,
  UPDATE_PROPOSAL_OUTCOME_PENDING
} from 'store/constants'
import {
  UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'

// FIXME these should not be using different constants and getting handled in
// different places -- they're doing the same thing!
import {
  REMOVE_SKILL_PENDING, ADD_SKILL, ADD_SKILL_TO_GROUP, REMOVE_SKILL_FROM_GROUP_PENDING
} from 'components/SkillsSection/SkillsSection.store'
import {
  REMOVE_SKILL_PENDING as REMOVE_SKILL_TO_LEARN_PENDING, ADD_SKILL as ADD_SKILL_TO_LEARN
} from 'components/SkillsToLearnSection/SkillsToLearnSection.store'

import {
  FETCH_COLLECTION_POSTS,
  UPDATE_GROUP_SETTINGS,
  UPDATE_GROUP_SETTINGS_PENDING
} from 'routes/GroupSettings/GroupSettings.store'
import {
  CREATE_GROUP
} from 'components/CreateGroup/CreateGroup.store'
import { FETCH_GROUP_WELCOME_DATA } from 'routes/GroupWelcomeModal/GroupWelcomeModal.store'

import {
  DELETE_GROUP_TOPIC_PENDING
} from 'routes/AllTopics/AllTopics.store'
import {
  INVITE_PEOPLE_TO_EVENT_PENDING
} from 'components/EventInviteDialog/EventInviteDialog.store'
import { FETCH_GROUP_TO_GROUP_JOIN_QUESTIONS } from 'routes/GroupSettings/RelatedGroupsTab/RelatedGroupsTab.store'
import {
  RECEIVE_POST
} from 'components/SocketListener/SocketListener.store'

import orm from 'store/models'
import clearCacheFor from './clearCacheFor'
import { find, get, values } from 'lodash/fp'
import extractModelsFromAction from '../ModelExtractor/extractModelsFromAction'
import { isPromise } from 'util/index'
import ModerationAction from 'store/models/ModerationAction'

export default function ormReducer (state = orm.getEmptyState(), action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const {
    Comment,
    EventInvitation,
    Group,
    GroupRelationship,
    GroupRelationshipInvite,
    GroupTopic,
    Invitation,
    JoinRequest,
    Me,
    Membership,
    Message,
    MessageThread,
    Person,
    Post,
    PostCommenter,
    ProjectMember,
    Skill,
    Topic
  } = session

  if (payload && !isPromise(payload) && meta && meta.extractModel) {
    extractModelsFromAction(action, session)
  }

  let me, membership, group, person, post, comment, groupTopic, childGroup

  switch (type) {
    case ACCEPT_GROUP_RELATIONSHIP_INVITE: {
      const newGroupRelationship = payload.data.acceptGroupRelationshipInvite.groupRelationship
      if (newGroupRelationship) {
        childGroup = Group.withId(newGroupRelationship.childGroup.id)
        Group.withId(newGroupRelationship.parentGroup.id).updateAppending({ childGroups: [childGroup] })
        GroupRelationshipInvite.withId(meta.id).delete()
        clearCacheFor(Group, childGroup.id)
      }
      break
    }

    case ADD_PROPOSAL_VOTE_PENDING: {
      me = Me.first()
      const optionId = meta.optionId
      const postId = meta.postId
      post = session.Post.withId(postId)

      const optimisticUpdate = { proposalVotes: { ...post.proposalVotes, items: [...post.proposalVotes.items, { postId, optionId, user: me }] } }
      post.update(optimisticUpdate)
      break
    }

    case ADD_SKILL: {
      const skill = payload.data.addSkill
      person = Person.withId(Me.first().id)
      person.updateAppending({ skills: [Skill.create(skill)] })
      me = Me.first()
      me.updateAppending({ skills: [Skill.create(skill)] })
      break
    }

    case ADD_SKILL_TO_GROUP: {
      const skill = payload.data.addSuggestedSkillToGroup
      group = Group.withId(meta.groupId)
      group.updateAppending({ suggestedSkills: [Skill.create(skill)] })
      clearCacheFor(Group, meta.groupId)
      break
    }

    case ADD_SKILL_TO_LEARN: {
      const skillToLearn = payload.data.addSkillToLearn
      person = Person.withId(Me.first().id)
      person.updateAppending({ skillsToLearn: [Skill.create(skillToLearn)] })
      break
    }

    case CANCEL_GROUP_RELATIONSHIP_INVITE:
    case REJECT_GROUP_RELATIONSHIP_INVITE: {
      const invite = GroupRelationshipInvite.withId(meta.id)
      invite.delete()
      break
    }

    case CLEAR_MODERATION_ACTION_PENDING: {
      if (meta.data) {
        post = Post.withId(meta?.data?.postId)
        const moderationAction = ModerationAction.withId(meta.data.moderationActionId)
        moderationAction.update({ status: 'cleared' })
      }
      break
    }

    case CREATE_COMMENT: {
      Comment.withId(meta.tempId).delete()
      if (!PostCommenter.safeGet({ post: meta.postId, commenter: Me.first().id })) {
        PostCommenter.create({ post: meta.postId, commenter: Me.first().id })
        // we can assume the following because the backend returns the results pre-sorted
        // with the currentUser at the beginning
        const p = Post.withId(meta.postId)
        p.update({ commentersTotal: p.commentersTotal + 1 })
        p.update({ commentsTotal: p.commentsTotal + 1 })
      }
      break
    }

    case CREATE_COMMENT_PENDING: {
      Comment.create({
        id: meta.tempId,
        post: meta.postId,
        text: meta.text,
        creator: Me.first().id
      })
      break
    }

    case CREATE_GROUP: {
      me = Me.withId(Me.first().id)
      me.updateAppending({
        memberships: [payload.data.createGroup.memberships.items[0].id],
        membershipCommonRoles: payload.data.createGroup.memberships.items[0].person.membershipCommonRoles.items
      })
      clearCacheFor(Me, me.id)
      break
    }

    case CREATE_JOIN_REQUEST: {
      if (payload.data.createJoinRequest.request) {
        me = Me.first()
        const jr = JoinRequest.create({ group: meta.groupId, user: me.id, status: payload.data.createJoinRequest.request.status })
        me.updateAppending({ joinRequests: [jr] })
      }
      break
    }

    case CREATE_MESSAGE: {
      Message.withId(meta.tempId).delete()
      const message = payload.data.createMessage
      MessageThread.withId(message.messageThread.id).newMessageReceived()
      break
    }

    case CREATE_MESSAGE_PENDING: {
      Message.create({
        id: meta.tempId,
        messageThread: meta.messageThreadId,
        text: meta.text,
        createdAt: new Date().toString(),
        creator: Me.first().id
      })
      break
    }

    case CREATE_MODERATION_ACTION_PENDING: {
      if (meta.data) {
        post = Post.withId(meta?.data?.postId)
        post.update({ flaggedGroups: post.flaggedGroups ? post.flaggedGroups.push(meta?.data?.groupId) : [meta?.data?.groupId] })
        post.update({ moderationActions: post.moderationActions ? post.moderationActions.push(meta?.data) : [meta?.data] })
      }
      break
    }

    case DELETE_COMMENT_PENDING: {
      comment = Comment.withId(meta.id)
      comment.delete()
      break
    }

    case DELETE_GROUP_RELATIONSHIP: {
      if (payload.data.deleteGroupRelationship.success) {
        const gr = GroupRelationship.safeGet({ parentGroup: meta.parentId, childGroup: meta.childId })
        if (gr) {
          gr.delete()
          clearCacheFor(Group, meta.parentId)
          clearCacheFor(Group, meta.childId)
        }
      }
      break
    }

    case DELETE_GROUP_TOPIC_PENDING: {
      groupTopic = GroupTopic.withId(meta.id)
      groupTopic.delete()
      break
    }

    case DELETE_POST_PENDING:
      post = Post.withId(meta.id)
      if (meta.groupId) {
        const group = Group.withId(meta.groupId)
        removePostFromGroup(post, group)
      }
      post.delete()
      break

    case FETCH_COLLECTION_POSTS:
      clearCacheFor(Group, meta.groupId)
      break

    case FETCH_GROUP_DETAILS_PENDING: {
      // Clear out prerequisite groups so they correclty update with latest data
      group = Group.safeGet({ slug: meta.slug })
      if (group) {
        group.update({ prerequisiteGroups: [] })
      }
      break
    }

    case FETCH_GROUP_TO_GROUP_JOIN_QUESTIONS: {
      const memberships = get('data.me.memberships', payload)
      if (memberships) {
        memberships.forEach(m => clearCacheFor(Membership, m.id))
      }
      break
    }

    case FETCH_GROUP_WELCOME_DATA: {
      clearCacheFor(Group, meta.id)
      membership = Membership.safeGet({ group: meta.id, person: meta.userId })
      membership && clearCacheFor(Membership, membership.id)
      break
    }

    case FETCH_MESSAGES_PENDING: {
      if (meta.reset) {
        // this is so that after websocket reconnect events, pagination
        // of messages works as expected
        Message.filter({ messageThread: meta.id }).delete()
      }
      break
    }

    case FETCH_POSTS_PENDING: {
      // When looking at group for first time, immediately set lastViewedAt so we know first view has happened
      // This is so that we can go to /explore page on first view then every time after go to regular home page
      if (meta.slug) {
        group = Group.safeGet({ slug: meta.slug })
        me = Me.first()
        if (!me) break
        membership = Membership.safeGet({ group: group.id, person: me.id })
        if (!membership) break
        membership && membership.update({ lastViewedAt: (new Date()).toISOString() }) // now non-members can possibly see the posts of a group, so in that instance, don't update
      }
      break
    }

    case INVITE_CHILD_TO_JOIN_PARENT_GROUP: {
      const newGroupRelationship = payload.data.inviteGroupToJoinParent.groupRelationship
      if (newGroupRelationship) {
        clearCacheFor(Group, newGroupRelationship.parentGroup.id)
        clearCacheFor(Group, newGroupRelationship.childGroup.id)
      } else {
        const newGroupRelationshipInvite = payload.data.inviteGroupToJoinParent.groupRelationshipInvite
        if (newGroupRelationshipInvite) {
          clearCacheFor(Group, newGroupRelationshipInvite.toGroup.id)
          clearCacheFor(Group, newGroupRelationshipInvite.fromGroup.id)
        }
      }
      break
    }

    case INVITE_PEOPLE_TO_EVENT_PENDING: {
      meta.inviteeIds.forEach(inviteeId => {
        EventInvitation.create({
          event: meta.eventId,
          person: inviteeId
        })
      })
      clearCacheFor(Post, meta.eventId)
      break
    }

    case JOIN_PROJECT_PENDING: {
      me = Me.first()
      ProjectMember.create({ post: meta.id, member: me.id })
      clearCacheFor(Post, meta.id)
      break
    }

    case LEAVE_GROUP: {
      me = Me.first()
      membership = find(m => m.group.id === meta.id, me.memberships.toModelArray())
      if (membership) membership.delete()
      membership = Membership.safeGet({ group: meta.id, person: me.id })
      if (membership) membership.delete()
      break
    }

    case LEAVE_PROJECT_PENDING: {
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
    }

    case PROCESS_STRIPE_TOKEN_PENDING: {
      post = Post.withId(meta.postId)
      const totalContributions = Number(post.totalContributions) + Number(meta.amount)
      post.update({
        totalContributions
      })
      break
    }

    case RECEIVE_POST: {
      const post = Post.withId(payload.data?.post?.id)
      if (post) {
        post.groups.toModelArray().forEach(g => {
          const group = Group.withId(g.id)
          if (!group) return
          group.update({ postCount: group.postCount + 1 })
          post.topics.toModelArray().forEach(t => {
            const topic = Topic.withId(t.id)
            if (!topic) return
            const groupTopic = topic.groupTopics.filter({ group: group.id }).first()
            if (!groupTopic) return
            groupTopic.update({ postsTotal: groupTopic.postsTotal + 1 })
          })
        })
      }
      break
    }

    case REMOVE_SKILL_FROM_GROUP_PENDING: {
      group = Group.withId(meta.groupId)
      group.suggestedSkills.remove(meta.skillId)
      clearCacheFor(Group, meta.groupId)
      break
    }

    case REMOVE_POST_PENDING: {
      post = Post.withId(meta.postId)
      const groups = post.groups.filter(c =>
        c.slug !== meta.slug).toModelArray()
      post.update({ groups })
      const group = Group.safeGet({ slug: meta.slug })
      removePostFromGroup(post, group)
      break
    }

    case REMOVE_SKILL_PENDING: {
      // Remove from the Me object and the Person object to be safe, catch in case they dont exist there
      try {
        person = Person.withId(Me.first().id)
        person.skills.remove(meta.skillId)
      } catch (e) {}
      try {
        me = Me.first()
        me.skills.remove(meta.skillId)
      } catch (e) {}
      break
    }

    case REMOVE_SKILL_TO_LEARN_PENDING: {
      person = Person.withId(Me.first().id)
      person.skillsToLearn.remove(meta.skillId)
      break
    }

    case REMOVE_PROPOSAL_VOTE_PENDING: {
      me = Me.first()
      const userId = me.id
      const optionId = meta.optionId
      const postId = meta.postId
      post = session.Post.withId(postId)
      const voteIndex = post.proposalVotes.items.findIndex(vote => vote?.user?.id === userId && vote.optionId === optionId)
      const newProposalVotes = [...post.proposalVotes.items]
      newProposalVotes.splice(voteIndex, 1)
      const proposalVotes = { ...post.proposalVotes, items: newProposalVotes }
      post.update({ proposalVotes })
      break
    }

    case REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP: {
      const newGroupRelationship = payload.data.requestToAddGroupToParent.groupRelationship
      if (newGroupRelationship) {
        clearCacheFor(Group, newGroupRelationship.parentGroup.id)
        clearCacheFor(Group, newGroupRelationship.childGroup.id)
      } else {
        const newGroupRelationshipInvite = payload.data.requestToAddGroupToParent.groupRelationshipInvite
        if (newGroupRelationshipInvite) {
          clearCacheFor(Group, newGroupRelationshipInvite.toGroup.id)
          clearCacheFor(Group, newGroupRelationshipInvite.fromGroup.id)
        }
      }
      break
    }

    case RESET_NEW_POST_COUNT_PENDING: {
      if (meta.type === 'GroupTopic') {
        session.GroupTopic.withId(meta.id).update({ newPostCount: 0 })
      } else if (meta.type === 'Membership') {
        me = Me.first()
        const membership = Membership.safeGet({ group: meta.id, person: me.id })
        membership && membership.update({ newPostCount: 0 })
      }
      break
    }

    case RESPOND_TO_EVENT_PENDING: {
      const event = Post.withId(meta.id)
      event.update({ myEventResponse: meta.response })
      break
    }

    case SWAP_PROPOSAL_VOTE_PENDING: {
      me = Me.first()
      const userId = me.id
      const addOptionId = meta.addOptionId
      const removeOptionId = meta.removeOptionId
      const postId = meta.postId
      post = session.Post.withId(postId)
      const voteIndex = post.proposalVotes.items.findIndex(vote => vote.user.id === userId && vote.optionId === removeOptionId)
      const newProposalVotes = [...post.proposalVotes.items]
      newProposalVotes[voteIndex] = { postId, optionId: addOptionId, user: me }
      const proposalVotes = { ...post.proposalVotes, items: newProposalVotes }
      post.update({ proposalVotes })
      break
    }

    case TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING: {
      groupTopic = GroupTopic.get({ topic: meta.topicId, group: meta.groupId })
      groupTopic.update({
        followersTotal: groupTopic.followersTotal + (meta.isSubscribing ? 1 : -1),
        isSubscribed: !!meta.isSubscribing
      })
      break
    }

    case UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING: {
      const memberships = session.Membership.all()
      memberships.toModelArray().forEach(membership => {
        membership.update({
          settings: {
            ...membership.settings,
            ...meta.settings
          }
        })
      })
      break
    }

    case UPDATE_COMMENT_PENDING: {
      comment = Comment.withId(meta.id)
      comment.update(meta.data)
      break
    }

    case UPDATE_GROUP_SETTINGS: {
      // Set new join questions in the ORM
      if (payload.data.updateGroupSettings && (payload.data.updateGroupSettings.joinQuestions || payload.data.updateGroupSettings.prerequisiteGroups)) {
        group = Group.withId(meta.id)
        clearCacheFor(Group, meta.id)
      }
      if (payload.data.updateGroupSettings && (payload.data.updateGroupSettings.customViews)) {
        group = Group.withId(meta.id)
        clearCacheFor(Group, meta.id)
      }

      if (payload.data.updateGroupSettings && (payload.data.updateGroupSettings.agreements)) {
        // Optimistically update the agreementsAcceptedAt setting, so the person adding the agreements doesnt have to immediately accept them
        me = Me.first()
        membership = Membership.safeGet({ group: meta.id, person: me.id })
        const newSettings = {
          ...membership.settings,
          agreementsAcceptedAt: new Date()
        }
        membership.update({ settings: newSettings })

        group = Group.withId(meta.id)
        clearCacheFor(Group, meta.id)
      }
      break
    }

    case UPDATE_GROUP_SETTINGS_PENDING: {
      group = Group.withId(meta.id)
      group.update(meta.changes)
      me = Me.first()
      // Clear out prerequisiteGroups so they can be reset when the UPDATE completes
      group.update({ prerequisiteGroups: [] })

      // Triggers an update to redux-orm for the membership
      membership = Membership.safeGet({ group: meta.id, person: me.id }).update({ forceUpdate: new Date() })
      break
    }

    case UPDATE_GROUP_TOPIC_PENDING: {
      groupTopic = GroupTopic.withId(meta.id)
      groupTopic.update(meta.data)
      clearCacheFor(GroupTopic, meta.id)
      break
    }

    case UPDATE_MEMBERSHIP_SETTINGS_PENDING: {
      me = Me.first()
      membership = Membership.safeGet({ group: meta.groupId, person: me.id })

      const newSettings = {
        ...membership.settings,
        ...meta.settings
      }

      // Do this here as a way to optimistically update the agreementsAcceptedAt setting,
      // without actually passing it to the server since that will be set auomatically on the back-end
      if (meta.acceptAgreements) {
        newSettings.agreementsAcceptedAt = new Date()
      }

      if (!membership) break
      membership.update({
        settings: newSettings
      })
      break
    }

    case UPDATE_POST: {
      // This is needed right now to make sure posts update in real time on the landing page
      if (payload.data.updatePost.groups) {
        payload.data.updatePost.groups.forEach(g => clearCacheFor(Group, g.id))
      }
      break
    }

    case UPDATE_POST_PENDING: {
      // deleting all attachments and removing topics here because we restore them from the result of the UPDATE_POST action
      post = Post.withId(meta.id)
      post.attachments.toModelArray().map(a => a.delete())
      post.update({ topics: [] })
      break
    }

    case UPDATE_THREAD_READ_TIME: {
      MessageThread.withId(meta.id).markAsRead()
      break
    }

    case UPDATE_PROPOSAL_OUTCOME_PENDING: {
      post = Post.withId(meta.postId)
      post.update({ proposalOutcome: meta.proposalOutcome })
      break
    }

    case UPDATE_USER_SETTINGS_PENDING:
    case UPDATE_USER_SETTINGS_GLOBAL_PENDING: {
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
    }

    case UPDATE_WIDGET: {
      clearCacheFor(Group, payload.data.updateWidget.group.id)
      break
    }

    case USE_INVITATION: {
      me = Me.first()
      me.updateAppending({ memberships: [payload.data.useInvitation.membership.id] })
      Invitation.filter({ email: me.email, group: payload.data.useInvitation.membership.group.id }).delete()
      break
    }

    case RECORD_CLICKTHROUGH_PENDING: {
      post = Post.withId(meta.postId)
      post.update({ clickthrough: true })
      break
    }

    case REACT_ON_COMMENT_PENDING: {
      comment = session.Comment.withId(meta.commentId)
      const emojiFull = meta.data.emojiFull
      me = Me.first()

      const optimisticUpdate = {
        myReactions: [...(comment.myReactions || []), { emojiFull }],
        commentReactions: [...(comment.commentReactions || []), { emojiFull, user: { name: me.name, id: me.id } }]
      }

      comment.update(optimisticUpdate)

      break
    }

    case REMOVE_REACT_ON_COMMENT_PENDING: {
      comment = session.Comment.withId(meta.commentId)
      const emojiFull = meta.data.emojiFull
      me = Me.first()
      const commentReactions = comment.commentReactions.filter(reaction => {
        if (reaction.emojiFull === emojiFull && reaction.user.id === me.id) return false
        return true
      })
      comment.update({ myReactions: comment.myReactions.filter(react => react.emojiFull !== emojiFull), commentReactions })
      break
    }

    case REACT_ON_POST_PENDING: {
      post = session.Post.withId(meta.postId)
      const emojiFull = meta.data.emojiFull
      me = Me.first()

      const optimisticUpdate = { myReactions: [...post.myReactions, { emojiFull }], postReactions: [...post.postReactions, { emojiFull, user: { name: me.name, id: me.id } }] }

      post.update(optimisticUpdate)

      break
    }

    case REMOVE_REACT_ON_POST_PENDING: {
      post = session.Post.withId(meta.postId)
      const emojiFull = meta.data.emojiFull
      me = Me.first()
      const postReactions = post.postReactions.filter(reaction => {
        if (reaction.emojiFull === emojiFull && reaction.user.id === me.id) return false
        return true
      })
      post.update({ myReactions: post.myReactions.filter(react => react.emojiFull !== emojiFull), postReactions })
      break
    }
  }

  values(sessionReducers).forEach(fn => fn(session, action))

  return session.state
}

// XXX: this is ugly, would be better to load these posts through redux-orm "queries" so they update automatically
const removePostFromGroup = (post, group) => {
  if (post && group) {
    if (post.announcement) {
      group.update({ announcements: group.announcements.filter(p => p.id !== post.id).toModelArray() })
    }
    if (post.type === 'request' || post.type === 'offer') {
      group.update({ openOffersAndRequests: group.openOffersAndRequests.filter(p => p.id !== post.id).toModelArray() })
    } else if (post.type === 'event') {
      group.update({ upcomingEvents: group.upcomingEvents.filter(p => p.id !== post.id).toModelArray() })
    } else if (post.type === 'project') {
      group.update({ activeProjects: group.activeProjects.filter(p => p.id !== post.id).toModelArray() })
    }
  }
}
