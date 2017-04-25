import { createSelector } from 'reselect'
import { mapKeys } from 'lodash'
import { fromJS } from 'immutable'
import sampleHashtags from './sampleHashtags'
import * as hashtagPlugin from './hashtagPlugin'

export const MODULE_NAME = 'HyloEditor'

const defaultHashtagSuggestionFilter = hashtagPlugin.defaultSuggestionsFilter

const FIND_MENTIONS = `${MODULE_NAME}/FIND_MENTIONS`
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
    }
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
  mentionResults: fromJS([]),
  hashtagResults: sampleHashtags
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS:
      const people = payload.data.people.items.map((person) =>
        mapKeys(person, (value, key) => {
          return {
            avatarUrl: 'avatar'
          }[key] || key
        }
      ))
      return {...state, mentionResults: fromJS(people)}
    case CLEAR_MENTIONS:
      return {...state, mentionResults: fromJS([])}
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

export const getMentionResults = createSelector(
  moduleSelector,
  (state, props) => state.mentionResults
)

export const getHashtagResults = createSelector(
  moduleSelector,
  (state, props) => state.hashtagResults
)
