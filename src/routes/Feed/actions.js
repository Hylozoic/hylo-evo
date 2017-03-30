import { FETCH_FEEDITEMS } from 'store/constants'

export function fetchFeedItems (id, opts = {}) {
  return {
    type: FETCH_FEEDITEMS,
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
