import { createSelector } from 'reselect'
import sampleCommunities from './sampleCommunities'

export const MODULE_NAME = 'CommunitiesSelector'

const FIND_SUGGESTIONS = 'hyloEditor/FIND_SUGGESTIONS'
const CLEAR_SUGGESTIONS = 'hyloEditor/CLEAR_SUGGESTIONS'

// Action Creators

export function findSuggestions (searchText) {
  return {
    type: FIND_SUGGESTIONS,
    payload: { searchText }
  }
}

export function clearSuggestions (searchText) {
  return { type: CLEAR_SUGGESTIONS }
}

// Reducer

const defaultState = {
  communitiesResults: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_SUGGESTIONS:
      const communitiesResults = sampleCommunities.filter(community =>
        community.name.match(new RegExp('^' + payload.searchText))
      )
      return {...state, communitiesResults}
    case CLEAR_SUGGESTIONS:
      return {...state, communitiesResults: []}
    default:
      return state
  }
}

// Selectors

export const moduleSelector = (state) => state[MODULE_NAME]

export const getCommunitiesResults = createSelector(
  moduleSelector,
  (state, props) => state.communitiesResults
)
