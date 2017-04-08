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
  communitiesResults: sampleCommunities
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_COMMUNITIES:
      // filter(i =>
      //   String(i
      //     .get('name')
      //     .replace(/\s+/g, '')
      //     .toLowerCase()
      //     .indexOf(lowerSearch) !== -1
      //   )
      // )
      // .take(5)
      return {...state, communitiesResults: filter(payload.searchText)(sampleCommunities)}
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
