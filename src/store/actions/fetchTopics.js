import { get } from 'lodash/fp'
import { FETCH_DEFAULT_TOPICS, FETCH_TOPICS } from '../constants'
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
  // Note: Update backend to accept multiple `groupSlugs`.
  //       Currenly this fetch will respond to a singular provided `groupSlug`
  //       or the `slug` ofthe first in a provided array of `groups`.
  const groupSlug = queryVariables.groupSlug || get('groups[0].slug', queryVariables)

  return {
    type: FETCH_DEFAULT_TOPICS,
    graphql: {
      query: topicsQuery,
      variables: {
        ...queryVariables,
        groupSlug,
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
