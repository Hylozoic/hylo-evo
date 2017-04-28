import {
  EXTRACT_MODEL,
  CREATE_COMMENT,
  CREATE_COMMENT_PENDING,
  LEAVE_COMMUNITY,
  VOTE_ON_POST_PENDING
} from 'store/constants'
import orm from 'store/models'
import ModelExtractor from './ModelExtractor'
import { find } from 'lodash/fp'

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
        id: meta.tempId,
        post: meta.postId,
        text: meta.text,
        creator: session.Me.first().id
      })
      break

    case CREATE_COMMENT:
      session.Comment.withId(meta.tempId).delete()
      break

    case LEAVE_COMMUNITY:
      const me = session.Me.first()
      const membership = find(m => m.community.id === meta.id, me.memberships.toModelArray())
      membership && membership.delete()
      break

    case VOTE_ON_POST_PENDING:
      const post = session.Post.withId(meta.postId)
      if (post.myVote) {
        post.update({myVote: false, votesTotal: (post.votesTotal || 1) - 1})
      } else {
        post.update({myVote: true, votesTotal: (post.votesTotal || 0) + 1})
      }
      break
  }

  return session.state
}
