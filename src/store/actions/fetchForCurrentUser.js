import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import MeQuery from 'graphql/queries/MeQuery.graphql'

export default function fetchForCurrentUser (slug) {
  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {
      query: MeQuery,
      variables: {
        includeGroup: !!slug,
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
          getRoot: get(slug ? 'group' : 'groupTopics'),
          modelName: slug ? 'Group' : 'GroupTopic',
          append: true
        }
      ]
    }
  }
}

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({
  slug,
  first: 200,
  offset: 0,
  subscribed: true,
  updateLastViewed: true
})
