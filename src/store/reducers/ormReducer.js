import {
  ADD_MODERATOR_PENDING,
  REMOVE_MODERATOR_PENDING,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  EXTRACT_MODEL,
  FETCH_NOTIFICATIONS,
  FETCH_MESSAGES_PENDING,
  LEAVE_COMMUNITY,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING,
  RESET_NEW_POST_COUNT_PENDING,
  TOGGLE_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_THREAD_READ_TIME,
  VOTE_ON_POST_PENDING,
  UPDATE_COMMUNITY_SETTINGS_PENDING
} from 'store/constants'
import { REMOVE_MEMBER_PENDING } from 'routes/Members/Members.store'
import {
  RECEIVE_MESSAGE,
  RECEIVE_POST
 } from 'components/SocketListener/SocketListener.store'
import {
  DELETE_POST_PENDING
 } from 'components/PostCard/PostHeader/PostHeader.store'
import {
  UPDATE_MEMBERSHIP_SETTINGS_PENDING,
  UPDATE_USER_SETTINGS_PENDING
} from 'routes/UserSettings/UserSettings.store'
import {
  FETCH_FOR_COMMUNITY_PENDING
} from 'routes/PrimaryLayout/PrimaryLayout.store'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { find } from 'lodash/fp'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const {
    Activity,
    Comment,
    Community,
    CommunityTopic,
    Me,
    Membership,
    Message,
    MessageThread,
    Notification,
    Person,
    Post,
    PostCommenter
  } = session

  const invalidateNotifications = () => {
    const first = Notification.first()
    first && first.update({time: Date.now()})
  }

  let membership

  switch (type) {
    case EXTRACT_MODEL:
      ModelExtractor.addAll({
        session,
        root: payload,
        modelName: meta.modelName,
        append: meta.append
      })
      break

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

    case FETCH_NOTIFICATIONS:
      if (meta.resetCount) {
        Me.first().update({newNotificationCount: 0})
      }
      break

    case RECEIVE_MESSAGE:
      const id = payload.data.message.messageThread
      if (!MessageThread.hasId(id)) {
        MessageThread.create({
          id,
          updatedAt: new Date().toString(),
          lastReadAt: 0
        })
      }
      MessageThread.withId(id).newMessageReceived(meta.bumpUnreadCount)
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).markAsRead()
      break

    case LEAVE_COMMUNITY:
      var me = Me.first()
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
      const post = session.Post.withId(meta.postId)
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

    case RECEIVE_POST:
      if (payload.creatorId !== Me.first().id) {
        payload.topics.forEach(topicId => {
          const sub = CommunityTopic.safeGet({topic: topicId, community: payload.communityId})
          if (sub) sub.update({newPostCount: sub.newPostCount + 1})
        })
        membership = Membership.safeGet({community: payload.communityId})
        membership.update({newPostCount: membership.newPostCount + 1})
      }
      break

    case MARK_ACTIVITY_READ_PENDING:
      Activity.withId(meta.id).update({unread: false})
      // invalidating selector memoization
      invalidateNotifications()
      break

    case MARK_ALL_ACTIVITIES_READ_PENDING:
      Activity.all().update({unread: false})
      // invalidating selector memoization
      invalidateNotifications()
      break

    case ADD_MODERATOR_PENDING:
      const person = Person.withId(meta.personId)
      Community.withId(meta.communityId).updateAppending({moderators: [person]})
      break

    case REMOVE_MEMBER_PENDING:
      let community = Community.withId(meta.communityId)
      const members = community.members.filter(m => m.id !== meta.personId)
        .toModelArray()
      community.update({members})
      break

    case REMOVE_MODERATOR_PENDING:
      community = Community.withId(meta.communityId)
      const moderators = community.moderators.filter(m =>
        m.id !== meta.personId)
        .toModelArray()
      community.update({moderators})
      break

    case DELETE_POST_PENDING:
      Post.withId(meta.id).delete()
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

    case FETCH_FOR_COMMUNITY_PENDING:
      community = Community.safeGet({slug: meta.slug})
      if (!community) break
      membership = Membership.safeGet({community: community.id})
      if (!membership) break
      membership.update({newPostCount: 0})
  }

  return session.state
}
