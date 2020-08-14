import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const getComments = createSelector(
  state => orm.session(state.orm),
  (_, props) => props.postId,
  ({ Post }, id) => {
    var post
    try {
      post = Post.get({ id })
    } catch (e) {
      return []
    }
    return post.comments.orderBy(c => Number(c.id)).toModelArray()
      .map(comment => ({
        ...comment.ref,
        creator: comment.creator,
        attachments: comment.attachments.toRefArray()
      }))
  }
)

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalComments = createSelector(
  getCommentResults,
  get('total')
)
