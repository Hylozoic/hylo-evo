import orm from 'store/models/index'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { includes, mapKeys } from 'lodash'
import { get } from 'lodash/fp'
import presentTopic from 'store/presenters/presentTopic'

import {
  MODULE_NAME,
  FIND_MENTIONS,
  FIND_MENTIONS_PENDING,
  CLEAR_MENTIONS,
  FIND_TOPICS,
  FIND_TOPICS_PENDING,
  CLEAR_TOPICS
} from './HyloEditor.constants'

// Action Creators

export function findMentions (mentionSearchTerm) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: `query ($mentionSearchTerm: String) {
        people(autocomplete: $mentionSearchTerm, first: 5) {
          items {
            id
            name
            avatarUrl
          }
        }
      }`,
      variables: {
        mentionSearchTerm
      }
    },
    meta: { extractModel: 'Person' }
  }
}

export function clearMentions (searchText) {
  return { type: CLEAR_MENTIONS }
}

export function findTopics (topicsSearchTerm) {
  const collectTopics = results =>
    results.communityTopics.items.map(get('topic'))
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($topicsSearchTerm: String) {
        communityTopics(autocomplete: $topicsSearchTerm, first: 8) {
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
  topicResults: null,
  mentionSearchTerm: null
}

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS_PENDING:
      return { ...state, mentionSearchTerm: action.meta.graphql.variables.mentionSearchTerm }
    case CLEAR_MENTIONS:
      return { ...state, mentionSearchTerm: null }
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

export const getMentionResults = ormCreateSelector(
  orm,
  moduleSelector,
  (session, moduleNode) => {
    const { mentionSearchTerm } = moduleNode
    if (!mentionSearchTerm) return []
    return session.Person.all()
      .filter(person => {
        return includes(
          person.name && person.name.toLowerCase(),
          mentionSearchTerm.toLowerCase()
        )
      })
      .toRefArray()
      .map(person => {
        return mapKeys(person, (value, key) => {
          return {
            avatarUrl: 'avatar'
          }[key] || key
        })
      })
  }
)

export const getTopicResults = ormCreateSelector(
  orm,
  getTopicsSearchTerm,
  (session, searchTerm) => {
    if (!searchTerm) return []

    // FIXME: if the user has been browsing multiple communities, this will
    // include results that don't belong to the current community
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
