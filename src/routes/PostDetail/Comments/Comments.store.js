import { FETCH_COMMENTS, CREATE_COMMENT } from 'store/constants'
import { get, uniqueId } from 'lodash/fp'
import { createSelector } from 'reselect'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import CommentsQuery from 'graphql/queries/CommentsQuery.graphql'
import orm from 'store/models'

export function fetchComments (id, opts = {}) {
  const { cursor } = opts

  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: CommentsQuery,
      variables: {
        id,
        cursor
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments')
      }
    }
  }
}

const createCommentMutation = `mutation (
  $postId: String,
  $text: String
  $imageUrls: [String],
  $fileUrls: [String]
) {
  createComment(data: {
    postId: $postId,
    text: $text
    imageUrls: $imageUrls,
    fileUrls: $fileUrls  
  }) {
    id
    text
    post {
      id
    }
    creator {
      id
    }
    attachments {
      type
      url
      position
      id
    }
    createdAt
  }
}`
export function createComment ({
  postId,
  text,
  imageUrls = [],
  fileUrls = []
}) {
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: createCommentMutation,
      variables: {
        postId,
        text,
        imageUrls,
        fileUrls
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text,
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}

const getCommentResults = makeGetQueryResults(FETCH_COMMENTS)

export const getHasMoreComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalComments = createSelector(
  getCommentResults,
  get('total')
)

export const getComments = createSelector(
  state => orm.session(state.orm),
  (state, props) => props.postId,
  (session, id) => {
    var post
    try {
      post = session.Post.get({ id })
    } catch (e) {
      return []
    }
    return post.comments.orderBy(c => Number(c.id)).toModelArray()
      .map(comment => ({
        ...comment.ref,
        creator: comment.creator,
        image: comment.attachments.toModelArray()[0]
      }))
  })
