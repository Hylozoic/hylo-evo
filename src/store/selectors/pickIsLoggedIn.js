import { createSelector } from 'reselect'
import { get, pick } from 'lodash/fp'

export default createSelector(
  get('login'),
  pick('isLoggedIn')
)
