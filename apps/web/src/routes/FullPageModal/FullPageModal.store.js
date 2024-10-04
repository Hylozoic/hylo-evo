import {
  SET_CONFIRM_BEFORE_CLOSE
} from 'store/constants'

const defaultState = {
  confirm: false
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_CONFIRM_BEFORE_CLOSE:
      return {
        ...state,
        confirm: payload
      }
    default:
      return state
  }
}

export function setConfirmBeforeClose (confirm) {
  return {
    type: SET_CONFIRM_BEFORE_CLOSE,
    payload: confirm
  }
}
