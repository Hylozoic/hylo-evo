import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import sampleMentions from './sampleMentions'
import mentionPlugin from 'draft-js-mention-plugin'
import hashtagPlugin from './hashtagPlugin'

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

export default function reducer (state = {mentionResults: fromJS([])}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS:
      return {...state, mentionResults: defaultMentionsSuggestionFilter(payload.searchText, fromJS(sampleMentions))}
    case CLEAR_MENTIONS:
      return {...state, mentionResults: fromJS([])}
    case FIND_HASHTAGS:
      return {...state, mentionResults: defaultHashtagSuggestionFilter(payload.searchText, fromJS(['test', 'test2']))}
    case CLEAR_HASHTAGS:
      return {...state, mentionResults: fromJS([])}
    default:
      return state
  }
}

// Selectors

export const getMentionResults = createSelector(
  (state) => state.hyloEditor,
  (state, props) => state.mentionResults
)

export const getHashtagResults = createSelector(
  (state) => state.hyloEditor,
  (state, props) => state.hasTagResults
)
