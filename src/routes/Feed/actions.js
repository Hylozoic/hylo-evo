import { FETCH_FEED_ITEMS } from 'store/constants'

export function fetchFeedItems (slug, opts = {}) {
  const feedItemParams = `(first: ${opts.first || 2}, ${opts.cursor ? `cursor: ${opts.cursor},` : ''} order: "desc")`
  return {
    type: FETCH_FEED_ITEMS,
    graphql: {
      query: `{
        community(slug: "${slug}") {
          id
          name
          feedItems${feedItemParams} {
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
      }`
    }
  }
}
