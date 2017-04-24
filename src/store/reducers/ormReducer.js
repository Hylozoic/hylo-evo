import { EXTRACT_MODEL, CREATE_COMMENT, CREATE_COMMENT_PENDING } from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  if (type === EXTRACT_MODEL) {
    ModelExtractor.addAll({
      session,
      root: payload,
      modelName: meta.modelName
    })
  }

  if (type === CREATE_COMMENT_PENDING) {
    session.Comment.create({
      id: meta.tempId,
      post: meta.postId,
      text: meta.text,
      creator: session.Me.first().id})
  }

  if (type === CREATE_COMMENT) {
    session.Comment.withId(meta.tempId).delete()
  }

  return session.state
}
