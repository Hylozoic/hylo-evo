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
      rootModelName: 'Post'
    }
  }
}
