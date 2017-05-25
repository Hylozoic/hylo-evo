import {
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  EXTRACT_MODEL,
  FETCH_MESSAGES_PENDING,
  LEAVE_COMMUNITY,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING,
  RESET_NEW_POST_COUNT_PENDING,
  TOGGLE_TOPIC_SUBSCRIBE_PENDING,
  UPDATE_THREAD_READ_TIME,
  VOTE_ON_POST_PENDING
} from 'store/constants'
import {
  RECEIVE_MESSAGE,
  RECEIVE_POST
 } from 'components/SocketListener/SocketListener.store'
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
    CommunityTopic,
    Me,
    Membership,
    Message,
    MessageThread,
    Notification,
    Post,
    PostCommenter,
    TopicSubscription
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
        modelName: meta.modelName
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

    case RECEIVE_MESSAGE:
      MessageThread.withId(payload.data.message.messageThread).newMessageReceived(meta.bumpUnreadCount)
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).markAsRead()
      break

    case LEAVE_COMMUNITY:
      const me = Me.first()
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
      session[meta.type].withId(meta.id).update({newPostCount: 0})
      break

    case RECEIVE_POST:
      payload.topics.forEach(topicId => {
        const sub = TopicSubscription.safeGet({topic: topicId})
        if (sub) sub.update({newPostCount: sub.newPostCount + 1})
      })
      membership = Membership.safeGet({community: payload.communityId})
      membership.update({newPostCount: membership.newPostCount + 1})
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
  }

  return session.state
}
