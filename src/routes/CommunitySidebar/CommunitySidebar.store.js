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
          name
          slug
          description
          avatarUrl
          memberCount
          members (first: 8, sortBy: "id", order: "desc") {
            items {
              id
              name
              avatarUrl
            }
          }
          moderators {
            items {
              id
              name
              avatarUrl
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
