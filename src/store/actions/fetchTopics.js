import { get } from 'lodash/fp'
import { FETCH_TOPICS } from '../constants'
import topicsQuery from 'graphql/queries/topicsQuery'

export default function (queryVariables = {}) {
  return {
    type: FETCH_TOPICS,
    graphql: {
      query: topicsQuery,
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
