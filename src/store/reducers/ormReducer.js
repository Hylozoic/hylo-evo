import { EXTRACT_MODEL, CREATE_COMMENT_PENDING } from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { uniqueId } from 'lodash'

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
      id: uniqueId(`post${meta.postId}_`),
      post: meta.postId,
      text: meta.text,
      creator: session.Me.first().id})
  }

  return session.state
}
