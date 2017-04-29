// Constants
export const FETCH_COMMUNITY = 'FETCH_COMMUNITY'

// Action Creators
export function fetchCommunity (slug) {
  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query: `query ($slug: String) {
        community (slug: $slug) {
          id
          topicSubscriptions(first: 20, offset: 0) {      
            hasMore
            items {
              id
              newPostCount
              community {
                id
              }
              topic {
                id
                name
              }
            }
          }
        }
      }`,
      variables: {slug}
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
