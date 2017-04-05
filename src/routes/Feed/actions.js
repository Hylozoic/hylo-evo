import { FETCH_FEED_ITEMS } from 'store/constants'

export function fetchFeedItems (slug, opts = {}) {
  return {
    type: FETCH_FEED_ITEMS,
    graphql: {
      query: `query ($slug: String, $first: Int, $cursor: ID) {
        community(slug: $slug) {
          id
          name
          feedItems(first: $first, cursor: $cursor, order: "desc") {
            type
            content {
              ... on Post {
                id
                title
                details
                type
                creator {
                  id
                  name
                  avatarUrl
                }
                createdAt
                updatedAt
                commenters(first: 2) {
                  id
                  name
                  avatarUrl
                }
                commentersTotal
                linkPreview {
                  title
                  url
                  imageUrl
                }
                votesTotal
                communities {
                  id
                  name
                  slug
                }
              }
            }
          }
        }
      }`,
      variables: {
        slug,
        first: opts.first || 10,
        cursor: opts.cursor
      }
    }
  }
}
