import { FETCH_COMMENTS, CREATE_COMMENT } from 'store/constants'

export function fetchComments (id, opts = {}) {
  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: `query ($id: ID, $cursor: ID) {
        post(id: $id) {
          id
          comments(first: 3, cursor: $cursor, order: "desc") {
            id
            text
            creator {
              id
              name
              avatarUrl
            }
            createdAt
          }
          commentsTotal
        }
      }`,
      variables: {
        id,
        cursor: opts.cursor
      }
    },
    meta: {
      rootModelName: 'Post'
    }
  }
}

export function createComment(postId, text) {
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
      postId
    }
  }
}
