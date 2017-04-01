import { FETCH_FEEDITEM } from 'store/constants'

export function fetchFeedItems (id, opts = {}) {
  return {
    type: FETCH_FEEDITEM,
    graphql: {
      query: `{
        community(slug: "${id}") {
          id
          name
          feedItems(first: 10, order: "desc") {
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
              }
            }
          }
        }
      }`
    }
  }
}
