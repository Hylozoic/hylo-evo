import { FETCH_POST } from 'store/constants'

export function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
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
          comments(first: 10, order: "desc") {
            items {
              id
              text
              creator {
                id
                name
                avatarUrl
              }
              createdAt
            }
            total
            hasMore
          }
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
      }`,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }
}
