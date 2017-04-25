import { createSelector } from 'reselect'
import orm from 'store/models/index'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { includes, mapKeys } from 'lodash'
import { fromJS } from 'immutable'
import sampleHashtags from './sampleHashtags'
import * as hashtagPlugin from './hashtagPlugin'

export const MODULE_NAME = 'HyloEditor'

const defaultHashtagSuggestionFilter = hashtagPlugin.defaultSuggestionsFilter

const FIND_MENTIONS = `${MODULE_NAME}/FIND_MENTIONS`
const FIND_MENTIONS_PENDING = `${MODULE_NAME}/FIND_MENTIONS_PENDING`
const CLEAR_MENTIONS = `${MODULE_NAME}/CLEAR_MENTIONS`
const FIND_HASHTAGS = `${MODULE_NAME}/FIND_HASHTAGS`
const CLEAR_HASHTAGS = `${MODULE_NAME}/CLEAR_HASHTAGS`

// Action Creators

export function findMentions (searchText) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: `query ($searchText: String) {
        people(autocomplete: $searchText, first: 5) {
          items {
            id
            name
            avatarUrl
          }
        }
      }`,
      variables: {
        searchText
      }
    },
    meta: { extractModel: 'Person' }
  }
}

export function clearMentions (searchText) {
  return { type: CLEAR_MENTIONS }
}

export function findHashtags (searchText) {
  return {
    type: FIND_HASHTAGS,
    payload: { searchText }
  }
}

export function clearHashtags (searchText) {
  return { type: CLEAR_HASHTAGS }
}

// Reducer

const defaultState = {
  hashtagResults: sampleHashtags
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS_PENDING:
      return {...state, mentionSearchTerm: action.meta.graphql.variables.searchText}
    case CLEAR_MENTIONS:
      return {...state, mentionSearchTerm: ''}
    case FIND_HASHTAGS:
      return {...state, hashtagResults: defaultHashtagSuggestionFilter(payload.searchText, sampleHashtags)}
    case CLEAR_HASHTAGS:
      return {...state, hashtagResults: fromJS([])}
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
  state => moduleSelector(state).mentionSearchTerm,
  (session, searchText) => {
    const people = session.Person.all()
    .filter(person => {
      return includes(
        person.name && person.name.toLowerCase(),
        searchText && searchText.toLowerCase()
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

export const getHashtagResults = createSelector(
  moduleSelector,
  (state, props) => state.hashtagResults
)
