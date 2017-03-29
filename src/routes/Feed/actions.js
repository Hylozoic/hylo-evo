import { FETCH_POSTS } from 'store/constants'

export function fetchPosts (id, opts = {}) {
  return {
    type: FETCH_POSTS,
    graphql: {
      query: `{
        community(slug: "${id}") {
          id
          name
          feedItems(first: 2, order: "desc") {
            type
            content {
              ... on Post {
                id
                title
              }
            }
          }
        }
      }`
    }
  }
}

