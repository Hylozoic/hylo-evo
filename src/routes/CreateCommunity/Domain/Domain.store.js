import { ADD_COMMUNITY_DOMAIN } from '../CreateCommunity.store'

export function addCommunityDomain (domain) {
  return {
    type: ADD_COMMUNITY_DOMAIN,
    payload: {
      domain
    }
  }
}
