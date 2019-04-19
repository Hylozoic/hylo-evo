import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'

export default function holochainFetchPosts (slug) {
  return {
    type: FETCH_POSTS,
    graphql: {
      query: `query ($slug: String) {
        community(slug: $slug) {
          id
          slug
          posts {
            hasMore
            items {
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
            }
          }
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      holochainAPI: true,
      extractModel: 'Community',
      extractQueryResults: {
        getItems: get('payload.data.community.posts')
      }
    }
  }
}