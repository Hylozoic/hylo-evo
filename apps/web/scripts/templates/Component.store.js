// import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
// import { createSelector as ormCreateSelector } from 'redux-orm'
// import orm from 'store/models'

export const MODULE_NAME = 'Component'

// Constants
export const FETCH_EXAMPLE = `${MODULE_NAME}/FETCH_EXAMPLE`

// Action Creators
export function fetchExample () {
  return {
    type: FETCH_EXAMPLE
  }
}

// Reducer
const defaultState = {
  example: 'example value'
}

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    case FETCH_EXAMPLE:
      return { example: 'fetched example' }
    default:
      return state
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

/* export const getSomethingFromOrm = ormCreateSelector(
  orm,
  session => {
    return session.Me.first()
  }
) */

export const getExample = createSelector(
  moduleSelector,
  (state, props) => state.example
)
