import { FETCH_FOR_GROUP } from 'store/constants'
import groupQueryFragment from 'graphql/fragments/groupQueryFragment'
import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

export default function (slug) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${groupQueryFragment}
    }`
    : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
      ${groupTopicsQueryFragment}
    }`

  return {
    type: FETCH_FOR_GROUP,
    graphql: { query, variables: queryVariables(slug) },
    meta: {
      extractModel: slug ? 'Group' : 'GroupTopic',
      slug
    }
  }
}

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({ slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true })
