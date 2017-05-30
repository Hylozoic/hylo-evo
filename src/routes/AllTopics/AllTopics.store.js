export const MODULE_NAME = 'AllTopics'

const SET_SORT = `${MODULE_NAME}/SET_SORT`

const defaultState = {
  sort: 'followers'
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
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
