import { get } from 'lodash/fp'
import { ADD_COMMUNITY_DOMAIN, FETCH_COMMUNITY } from '../CreateCommunity.store'

export function addCommunityDomain (domain) {
  return {
    type: ADD_COMMUNITY_DOMAIN,
    payload: {
      domain
    }
  }
}

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
