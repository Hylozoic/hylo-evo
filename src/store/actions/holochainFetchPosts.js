import { get } from 'lodash/fp'

export const HOLOCHAIN_FETCH_POSTS = 'HOLOCHAIN_FETCH_POSTS'

export default function holochainFetchPosts (slug) {
  return {
    type: HOLOCHAIN_FETCH_POSTS,
    graphql: {
      query: `query ($slug: String) {
        community(slug: $slug) {
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