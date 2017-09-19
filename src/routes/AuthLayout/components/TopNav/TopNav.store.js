export const MODULE_NAME = 'TopNav'

// Constants
export const SET_TOP_NAV_POSITION = 'SET_TOP_NAV_POSITION'

// Action Creators
export function setTopNavPosition (params) {
  return {
    type: SET_TOP_NAV_POSITION,
    payload: params
  }
}

// Reducer
const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_TOP_NAV_POSITION:
      return payload
    default:
      return state
  }
}
