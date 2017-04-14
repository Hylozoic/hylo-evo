import { FETCH_COMMENTS } from 'store/constants'

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
