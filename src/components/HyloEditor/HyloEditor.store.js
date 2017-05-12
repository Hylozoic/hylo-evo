import orm from 'store/models/index'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { includes, mapKeys } from 'lodash'
import { fromJS } from 'immutable'

export const MODULE_NAME = 'HyloEditor'

export const FIND_MENTIONS = `${MODULE_NAME}/FIND_MENTIONS`
export const FIND_MENTIONS_PENDING = `${MODULE_NAME}/FIND_MENTIONS_PENDING`
export const CLEAR_MENTIONS = `${MODULE_NAME}/CLEAR_MENTIONS`
export const FIND_TOPICS = `${MODULE_NAME}/FIND_TOPICS`
export const FIND_TOPICS_PENDING = `${MODULE_NAME}/FIND_TOPICS_PENDING`
export const CLEAR_TOPICS = `${MODULE_NAME}/CLEAR_TOPICS`

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
    results.community.communityTopics.items.map(item => item.topic)
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($topicsSearchTerm: String) {
        community(slug: "test1") {
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
        topicsSearchTerm
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
