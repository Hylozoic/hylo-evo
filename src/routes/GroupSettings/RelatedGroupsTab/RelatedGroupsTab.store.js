import { createSelector } from 'reselect'

export const MODULE_NAME = 'RelatedGroups'

// Constants
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`

// Reducer
const defaultState = {
  sort: 'name',
  search: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search: payload
      }
    case SET_SORT:
      return {
        ...state,
        sort: payload
      }
    default:
      return state
  }
}

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

export function setSort (sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getSort = createSelector(
  moduleSelector,
  (state, props) => state.sort
)

export const getSearch = createSelector(
  moduleSelector,
  (state, props) => state.search
)
