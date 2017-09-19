import { FETCH_FOR_COMMUNITY } from 'store/constants'
import {
  communityQueryFragment,
  communityTopicsQueryFragment,
  queryVariables
} from 'store/actions/fetchForCurrentUser'

export default function fetchForCommunity (slug) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${communityQueryFragment}
    }`
    : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
      ${communityTopicsQueryFragment}
    }`

  return {
    type: FETCH_FOR_COMMUNITY,
    graphql: {query, variables: queryVariables(slug)},
    meta: {
      extractModel: slug ? 'Community' : 'CommunityTopic',
      slug
    }
  }
}
