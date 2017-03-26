import { createSelector } from 'reselect'

// TODO: Sample results until data available through API
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import mentionsSample from './mentionsSample'

const FIND_MENTIONS = 'hyloEditor/FIND_MENTIONS'

// Action Creators
export function findMentions (searchText) {
  return {
    type: FIND_MENTIONS,
    // TODO: Sample results until data available through API
    payload: defaultSuggestionsFilter(searchText.value, mentionsSample)
    // payload: {
    //   api: true,
    //   path: `/noo/autocomplete?q={searchText}`
    // }
  }
}

// Reducer
export default function reducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MENTIONS:
      return {...state, mentionResults: payload}
    default:
      return state
  }
}

// Selectors
export const getMentionResults = createSelector(
  (state) => state.hyloEditor,
  (state, props) => state.mentionResults
)
