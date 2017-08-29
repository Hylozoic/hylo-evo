import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export default createSelector(
  get('login'),
  get('returnToURL')
)
