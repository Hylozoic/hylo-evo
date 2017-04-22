import { LOCATION_CHANGE } from 'react-router-redux'

export default function history (state = [], action) {
  const { type, payload } = action

  if (type === LOCATION_CHANGE) {
    return state.concat([payload])
  }

  return state
}
