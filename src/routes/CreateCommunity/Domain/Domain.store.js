// import { get } from 'lodash/fp'
import { FETCH_COMMUNITY_EXISTS } from '../CreateCommunity.store'

export function fetchCommunityExists (slug) {
  return {
    type: FETCH_COMMUNITY_EXISTS,
    graphql: {
      query: `
        query ($slug: String) {
          communityExists (slug: $slug) {
            exists
          }
        }
      `,
      variables: {
        slug
      }
    }
  }
}
