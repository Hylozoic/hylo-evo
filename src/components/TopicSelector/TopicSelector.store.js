import orm from 'store/models/index'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { includes } from 'lodash'
import { get } from 'lodash/fp'
import presentTopic from 'store/presenters/presentTopic'

export const MODULE_NAME = 'TopicSelector'
export const FIND_TOPICS = 'FIND_TOPICS'
export const FIND_TOPICS_PENDING = 'FIND_TOPICS_PENDING'
export const CLEAR_TOPICS = 'CLEAR_TOPICS'

export function findTopics (topicsSearchTerm) {
  const collectTopics = results =>
    results.groupTopics.items.map(get('topic'))
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($topicsSearchTerm: String) {
        groupTopics(autocomplete: $topicsSearchTerm, first: 8) {
          items {
            topic {
              id
              name
              followersTotal
              postsTotal
            }
          }
        }
      }`,
      variables: {
        topicsSearchTerm
      }
    },
    meta: {
      extractModel: {
        getRoot: collectTopics,
        modelName: 'Topic',
        append: true
      }
    }
  }
}

export function clearTopics (searchText) {
  return { type: CLEAR_TOPICS }
}

// Reducer

export const defaultState = {
  topicResults: null
}

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    case FIND_TOPICS_PENDING:
      return { ...state, topicsSearchTerm: action.meta.graphql.variables.topicsSearchTerm }
    case CLEAR_TOPICS:
      return { ...state, topicsSearchTerm: null }
    default:
      return state
  }
}

// Selectors

export const moduleSelector = (state) => {
  return state[MODULE_NAME]
}

export const getTopicsSearchTerm = (state) => {
  return state[MODULE_NAME].topicsSearchTerm
}

export const getTopicResults = ormCreateSelector(
  orm,
  getTopicsSearchTerm,
  (session, searchTerm) => {
    if (!searchTerm) return []

    // FIXME: if the user has been browsing multiple groups, this will
    // include results that don't belong to the current group
    return session.Topic.all()
      .filter(topic => {
        return includes(
          topic.name && topic.name.toLowerCase(),
          searchTerm.toLowerCase()
        )
      })
      .toModelArray().map(topic => presentTopic(topic, {}))
  }
)
