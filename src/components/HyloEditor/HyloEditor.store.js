import orm from 'store/models/index'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { includes, mapKeys } from 'lodash'
import { fromJS } from 'immutable'
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

// TODO: Still tied to a test community under the slug "test1"
export function findTopics (topicsSearchTerm, communitySlug = 'test1') {
  const collectTopics = results =>
    results.community.communityTopics.items.map(item => item.topic)
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($topicsSearchTerm: String, $communitySlug: String) {
        community(slug: $communitySlug) {
          communityTopics(autocomplete: $topicsSearchTerm, first: 1) {
            items {
              topic {
                id
                name
              }
            }
          }
        }
      }`,
      variables: {
        topicsSearchTerm,
        communitySlug
      }
    },
    meta: {
      extractModel: {
        getRoot: collectTopics,
        modelName: 'Topic'
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
      return {...state, mentionSearchTerm: action.meta.graphql.variables.mentionSearchTerm}
    case CLEAR_MENTIONS:
      return {...state, mentionSearchTerm: null}
    case FIND_TOPICS_PENDING:
      return {...state, topicsSearchTerm: action.meta.graphql.variables.topicsSearchTerm}
    case CLEAR_TOPICS:
      return {...state, topicsSearchTerm: null}
    default:
      return state
  }
}

// Selectors

export const moduleSelector = (state) => {
  return state[MODULE_NAME]
}

export const getMentionResults = ormCreateSelector(
  orm,
  state => state.orm,
  moduleSelector,
  (session, moduleNode) => {
    const { mentionSearchTerm } = moduleNode
    if (!mentionSearchTerm) return fromJS([])
    const people = session.Person.all()
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
    return fromJS(people)
  }
)

export const getTopicResults = ormCreateSelector(
  orm,
  state => state.orm,
  moduleSelector,
  (session, moduleNode) => {
    const { topicsSearchTerm } = moduleNode
    if (!topicsSearchTerm) return fromJS([])
    const topics = session.Topic.all()
      .filter(topic => {
        return includes(
          topic.name && topic.name.toLowerCase(),
          topicsSearchTerm.toLowerCase()
        )
      })
      .toRefArray()
    return fromJS(topics)
  }
)
