import { EXTRACT_MODEL, CREATE_COMMENT_PENDING, LEAVE_COMMUNITY } from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { uniqueId, find } from 'lodash/fp'

export default function ormReducer (state = {}, action) {
  const session = orm.session(state)
  const { payload, type, meta, error } = action
  if (error) return state

  switch (type) {
    case EXTRACT_MODEL:
      ModelExtractor.addAll({
        session,
        root: payload,
        modelName: meta.modelName
      })
      break

    case CREATE_COMMENT_PENDING:
      session.Comment.create({
        id: uniqueId(`post${meta.postId}_`),
        post: meta.postId,
        text: meta.text,
        creator: session.Me.first().id
      })
      break

    case LEAVE_COMMUNITY:
      const me = session.Me.first()
      const membership = find(m => m.community.id === meta.id, me.memberships.toModelArray())
      membership && membership.delete()
      break
  }

  return session.state
}
