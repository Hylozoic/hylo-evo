import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const getComments = createSelector(
  state => orm.session(state.orm),
  (_, props) => props.postId,
  ({ Post }, id) => {
    const post = Post.withId(id)
    if (!post) return []

    const naturalOrdering = c => Number(c.id)

    return post.comments.filter({ parentComment: null }).orderBy(naturalOrdering).toModelArray()
      .map(comment => ({
        ...comment.ref,
        creator: comment.creator,
        attachments: comment.attachments
          .orderBy('position').toRefArray(),
        childComments: post.comments.filter({ parentComment: comment.id })
          .orderBy(naturalOrdering).toRefArray()
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
