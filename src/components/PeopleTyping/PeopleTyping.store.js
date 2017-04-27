import { omit } from 'lodash/fp'
import {
  ADD_USER_TYPING,
  CLEAR_USER_TYPING
} from 'store/constants'

// Reducer
const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, meta } = action
  if (error) return state

  switch (type) {
    case ADD_USER_TYPING:
      return {...state, [meta.userId]: {name: meta.userName, timestamp: Date.now()}}
    case CLEAR_USER_TYPING:
      return omit([meta.userId], state)
    default:
      return state
  }
}
