import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import sampleMentions from './sampleMentions'

const FIND_MENTIONS = 'hyloEditor/FIND_MENTIONS'
const CLEAR_MENTIONS = 'hyloEditor/CLEAR_MENTIONS'

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

// Reducer

export default function reducer (state = {mentionResults: fromJS([])}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS:
      return {...state, mentionResults: defaultSuggestionsFilter(payload.searchText, fromJS(sampleMentions))}
    case CLEAR_MENTIONS:
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
