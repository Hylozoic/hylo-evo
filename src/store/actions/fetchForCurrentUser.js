import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import MeQuery from 'graphql/queries/MeQuery.graphql'

export default function (slug) {
  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {
      query: MeQuery,
      variables: {
        includeCommunity: slug,
        ...queryVariables(slug)
      }
    },
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
const queryVariables = slug => ({ slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true })
