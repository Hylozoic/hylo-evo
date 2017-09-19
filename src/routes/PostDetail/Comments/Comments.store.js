import { FETCH_COMMENTS, CREATE_COMMENT } from 'store/constants'
import { get, uniqueId } from 'lodash/fp'
import { createSelector } from 'reselect'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import orm from 'store/models'

export function fetchComments (id, opts = {}) {
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
        cursor: opts.cursor
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

export function createComment (postId, text) {
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: `mutation ($postId: String, $text: String) {
        createComment(data: {postId: $postId, text: $text}) {
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
      }`,
      variables: {
        postId,
        text
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text
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
      post = session.Post.get({id})
    } catch (e) {
      return []
    }
    return post.comments.orderBy(c => Number(c.id)).toModelArray()
    .map(c => {
      console.log('comment', c.attachments)
      return c
    })
    .map(comment => ({
      ...comment.ref,
      image: comment.attachments[0]
    }))
  })
