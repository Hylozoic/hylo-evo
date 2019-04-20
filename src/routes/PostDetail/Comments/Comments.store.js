import { FETCH_COMMENTS, CREATE_COMMENT } from 'store/constants'
import { get, uniqueId } from 'lodash/fp'
import { createSelector } from 'reselect'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import orm from 'store/models'

export function fetchComments (id, opts = {}, holochainAPI = false) {
  const { cursor } = opts

  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: `query ($id: ID, $cursor: ID) {
        post(id: $id) {
          id
          comments(first: 10, cursor: $cursor, order: "desc") {
            items {
              id
              text
              creator {
                id
                name
                avatarUrl
              }
              createdAt
              attachments {
                id
                url
              }
            }
            total
            hasMore
          }
        }
      }`,
      variables: {
        id,
        cursor
      }
    },
    meta: {
      holochainAPI,
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments')
      }
    }
  }
}

const holochainCreateCommentMutation = `mutation ($postId: String, $text: String, $createdAt: String) {
  createComment(data: {postId: $postId, text: $text, createdAt: $createdAt}) {
    id
    text
    post {
      id
    }
    createdAt
    creator {
      id
    }
  }
}`

const createCommentMutation = `mutation ($postId: String, $text: String) {
  createComment(data: {postId: $postId, text: $text}) {
    id
    text
    post {
      id
    }
    creator {
      id
    }
  }
}`
export function createComment (postId, text, holochainAPI = false) {
  const createdAt = new Date().toISOString()

  const variables = {
    postId,
    text
  }

  var query

  if (holochainAPI) {
    variables.createdAt = createdAt
    query = holochainCreateCommentMutation
  } else {
    query = createCommentMutation
  }

  return {
    type: CREATE_COMMENT,
    graphql: {
      query,
      variables
    },
    meta: {
      holochainAPI,
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
