import { get } from 'lodash/fp'
import { FETCH_TOPICS_FOR_CURRENT_USER } from '../constants'
import topicsForCurrentUserQuery from 'graphql/queries/topicsForCurrentUserQuery'

export default function (queryVariables = {}) {
  return {
    type: FETCH_TOPICS_FOR_CURRENT_USER,
    graphql: {
      query: topicsForCurrentUserQuery,
      variables: queryVariables
    },
    meta: {
      extractModel: [
        {
          modelName: 'Topic',
          getRoot: get('topics.items')
        },
        {
          modelName: 'CommunityTopic',
          getRoot: get('topic.items.communityTopics.items')
        }
      ],
      extractQueryResults: {
        getItems: get('payload.data.topics')
      }
    }
  }
}
