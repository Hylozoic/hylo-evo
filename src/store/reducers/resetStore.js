import { pick } from 'lodash/fp'
import { getEmptyState } from '..'
import login from './login'
import {
  LOGOUT,
  RESET_STORE
} from '../constants'

export const PRESERVE_STATE_ON_RESET = [
  'login',
  'pending',
  'locationHistory',
  'intercom',
  'mixpanel'
]

export default function (state, action) {
  if (action.type === LOGOUT && !action.error) {
    return getEmptyState()
  }

  if (action.type === RESET_STORE && !action.error) {
    return {
      ...getEmptyState(),
      ...pick(PRESERVE_STATE_ON_RESET, state)
    }
  }

  return state
}
