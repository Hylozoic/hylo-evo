import {
  ADD_MESSAGE_FROM_SOCKET,
  CREATE_MESSAGE,
  EXTRACT_MODEL,
  UPDATE_THREAD_READ_TIME
} from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  const { MessageThread } = session
  console.log(type)

  switch (type) {
    case EXTRACT_MODEL:
      ModelExtractor.addAll({
        session,
        root: payload,
        modelName: meta.modelName
      })
      break

    case CREATE_MESSAGE:
      const message = payload.data.createMessage
      MessageThread.withId(message.messageThread.id).update({
        updatedAt: new Date().toString()
      })
      break

    case ADD_MESSAGE_FROM_SOCKET:
      MessageThread.withId(payload.messageThread.id).update({
        updatedAt: new Date().toString()
      })
      break

    case UPDATE_THREAD_READ_TIME:
      MessageThread.withId(meta.id).update({
        lastReadAt: new Date().toString()
      })
      break
  }

  return session.state
}
