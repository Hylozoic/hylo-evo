import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import getMe from './getMe'

export default createSelector(
  getMe,
  me => get('blockedUsers', me) ? get('blockedUsers', me).toRefArray() : []
)
