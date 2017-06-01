export const MODULE_NAME = 'AllTopics'

const SET_SORT = `${MODULE_NAME}/SET_SORT`
const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`

const defaultState = {
  sort: 'followers',
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

export function setSort (sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

export function getSort(state) {
  return state[MODULE_NAME].sort
}

export function getSearch(state) {
  return state[MODULE_NAME].search
}
