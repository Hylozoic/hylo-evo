import { pick } from 'lodash/fp'
import { getEmptyState } from '..'
import { LOGOUT, RESET_STORE } from '../constants'

export const KEYS_PRESERVED_ON_RESET = [
  'pending',
  'locationHistory',
  'mixpanel'
]

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    return getEmptyState()
  }

  if (action.type === RESET_STORE && !action.error) {
    return {
      ...getEmptyState(),
      ...pick(KEYS_PRESERVED_ON_RESET, state)
    }
  }

  return state
}
