import { FETCH_FEED_ITEMS } from 'store/constants'

export function fetchFeedItems (id, opts = {}) {
  return {
    type: FETCH_FEED_ITEMS,
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
