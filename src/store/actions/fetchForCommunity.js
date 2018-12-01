import { FETCH_FOR_COMMUNITY } from 'store/constants'
import communityQueryFragment from 'graphql/fragments/communityQueryFragment'
import communityTopicsQueryFragment from 'graphql/fragments/communityTopicsQueryFragment'

export default function (slug) {
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

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true})
