import { createSelector } from 'reselect'
import sampleCommunities from './sampleCommunities'

const FIND_COMMUNITIES = 'hyloEditor/FIND_COMMUNITIES'
const CLEAR_COMMUNITIES = 'hyloEditor/CLEAR_COMMUNITIES'

// Action Creators

export function findCommunities (searchText) {
  return {
    type: FIND_COMMUNITIES,
    payload: { searchText }
  }
}

export function clearCommunities (searchText) {
  return { type: CLEAR_COMMUNITIES }
}

// Reducer

const defaultState = {
  communitiesResults: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_COMMUNITIES:
      const communitiesResults = sampleCommunities.filter(community =>
        community.name.match(new RegExp('^' + payload.searchText))
      )
      return {...state, communitiesResults}
    case CLEAR_COMMUNITIES:
      return {...state, communitiesResults: []}
    default:
      return state
  }
}

// Selectors

export const getCommunitiesResults = createSelector(
  (state) => state.CommunitiesSelector,
  (state, props) => state.communitiesResults
)
