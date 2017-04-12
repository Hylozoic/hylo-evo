import { FETCH_POST } from 'store/constants'

export function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: String) {
        post(id: $id) {
          id
          title
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      rootModelName: 'Post'
    }
  }
}
