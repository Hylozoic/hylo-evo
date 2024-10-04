import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const naturalOrdering = c => Number(c.id)

const normaliseCommentModel = post => comment => ({
  ...comment.ref,
  creator: comment.creator,
  attachments: comment.attachments
    .orderBy('position').toRefArray(),
  childComments: post
    .comments
    .filter({ parentComment: comment.id })
    .orderBy(naturalOrdering)
    .toModelArray()
    .map(normaliseCommentModel(post))
})

export const getComments = createSelector(
  state => orm.session(state.orm),
  (_, props) => props.postId || props.post?.id,
  ({ Post }, id) => {
    const post = Post.withId(id)
    if (!post) return []

    return post
      .comments
      .filter({ parentComment: null })
      .orderBy(naturalOrdering)
      .toModelArray()
      .map(normaliseCommentModel(post))
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
