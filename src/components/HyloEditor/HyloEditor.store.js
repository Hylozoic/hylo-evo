import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import sampleMentions from './sampleMentions'
import sampleHashtags from './sampleHashtags'
import * as mentionPlugin from 'draft-js-mention-plugin'
import * as hashtagPlugin from './hashtagPlugin'

export const MODULE_NAME = 'HyloEditor'

const defaultMentionsSuggestionFilter = mentionPlugin.defaultSuggestionsFilter
const defaultHashtagSuggestionFilter = hashtagPlugin.defaultSuggestionsFilter

const FIND_MENTIONS = 'hyloEditor/FIND_MENTIONS'
const CLEAR_MENTIONS = 'hyloEditor/CLEAR_MENTIONS'
const FIND_HASHTAGS = 'hyloEditor/FIND_HASHTAGS'
const CLEAR_HASHTAGS = 'hyloEditor/CLEAR_HASHTAGS'

// Action Creators

export function findMentions (searchText) {
  return {
    type: FIND_MENTIONS,
    payload: { searchText }
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
      return {...state, mentionResults: defaultMentionsSuggestionFilter(payload.searchText, sampleMentions)}
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
