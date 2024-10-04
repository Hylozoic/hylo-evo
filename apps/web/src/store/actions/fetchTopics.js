import { get } from 'lodash/fp'
import { FETCH_DEFAULT_TOPICS, FETCH_TOPICS } from '../constants'
import topicsQuery from '@graphql/queries/topicsQuery'

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
          modelName: 'GroupTopic',
          getRoot: get('topic.items.groupTopics.items')
        }
      ],
      extractQueryResults: {
        getItems: get('payload.data.topics')
      }
    }
  }
}

export function fetchDefaultTopics (queryVariables = {}) {
  return {
    type: FETCH_DEFAULT_TOPICS,
    graphql: {
      query: topicsQuery,
      variables: {
        ...queryVariables,
        sortBy: 'name',
        isDefault: true,
        visibility: [1, 2]
      }
    },
    meta: {
      extractModel: [
        {
          modelName: 'Topic',
          getRoot: get('topics.items')
        },
        {
          modelName: 'GroupTopic',
          getRoot: get('topic.items.groupTopics.items')
        }
      ],
      extractQueryResults: {
        getItems: get('payload.data.topics')
      }
    }
  }
}
