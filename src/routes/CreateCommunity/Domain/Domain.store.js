import { get } from 'lodash/fp'
import { FETCH_COMMUNITY } from '../CreateCommunity.store'

export function fetchCommunity (slug) {
  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query: `
        query ($slug: String) {
          community (slug: $slug) {
            id
            slug
          }
        }
      `,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Community',
      extractQueryResults: {
        getItems: get('payload.data.community')
      }
    }
  }
}
