import {
  ADD_MESSAGE_FROM_SOCKET,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  CREATE_MESSAGE,
  CREATE_MESSAGE_PENDING,
  EXTRACT_MODEL,
  FETCH_MESSAGES_PENDING,
  LEAVE_COMMUNITY,
  UPDATE_THREAD_READ_TIME
} from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { find } from 'lodash/fp'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const { Comment, Me, Message, MessageThread } = session

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

    case ADD_MESSAGE_FROM_SOCKET:
      MessageThread.withId(payload.data.message.messageThread).newMessageReceived(meta.bumpUnreadCount)
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).markAsRead()
      break

    case LEAVE_COMMUNITY:
      const me = Me.first()
      const membership = find(m => m.community.id === meta.id, me.memberships.toModelArray())
      membership && membership.delete()
      break
  }

  return session.state
}
