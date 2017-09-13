import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export const SET_RETURN_TO_URL = 'SET_RETURN_TO_URL'
export const RESET_RETURN_TO_URL = 'RESET_RETURN_TO_URL'

export function setReturnToURL (returnToURL) {
  return {
    type: SET_RETURN_TO_URL,
    payload: { returnToURL }
  }
}

export function resetReturnToURL (returnToURL) {
  return {type: RESET_RETURN_TO_URL}
}

export const getReturnToURL = createSelector(
  get('AuthRoute'),
  get('returnToURL')
)

export default function reducer (state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case SET_RETURN_TO_URL:
      return {
        ...state,
        returnToURL: payload.returnToURL
      }
    case RESET_RETURN_TO_URL:
      return {
        ...state,
        returnToURL: null
      }
  }
  return state
}
