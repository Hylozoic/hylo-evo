import orm from 'store/models/index'
import { includes, mapKeys } from 'lodash'
import { createSelector as ormCreateSelector } from 'redux-orm'
import filterDeletedUsers from 'util/filterDeletedUsers'

export const MODULE_NAME = 'MentionList'
export const FIND_MENTIONS = 'FIND_MENTIONS'
export const FIND_MENTIONS_PENDING = 'FIND_MENTIONS_PENDING'
export const CLEAR_MENTIONS = 'CLEAR_MENTIONS'

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

// Reducer

export const defaultState = {
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
  moduleSelector,
  (session, moduleNode) => {
    const { mentionSearchTerm } = moduleNode
    if (!mentionSearchTerm) return []
    return session.Person.all()
      .filter(filterDeletedUsers)
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
