import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import communityTopicsQueryFragment from 'graphql/fragments/communityTopicsQueryFragment'
import communityQueryFragment from 'graphql/fragments/communityQueryFragment'
import meQueryFragment from 'graphql/fragments/meQueryFragment'

export default function (slug, skipTopics) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${meQueryFragment}
      ${communityQueryFragment}
    }`
    : (skipTopics
      ? `{
        ${meQueryFragment}
      }`
      : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
        ${meQueryFragment}
        ${communityTopicsQueryFragment}
      }`)

  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {query, variables: queryVariables(slug)},
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me',
          append: true
        },
        {
          getRoot: get(slug ? 'community' : 'communityTopics'),
          modelName: slug ? 'Community' : 'CommunityTopic',
          append: true
        }
      ]
    }
  }
}

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true})
