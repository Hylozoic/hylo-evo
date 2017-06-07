export const MODULE_NAME = 'Search'

const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`

const defaultState = {
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

export function getSearch (state) {
  return state[MODULE_NAME].search
}

export function fetchSearch () {
  
}
