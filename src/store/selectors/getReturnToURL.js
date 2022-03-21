import { createSelector } from 'reselect'
import { get } from 'lodash/fp'

export const getReturnToURL = createSelector(
  get('login'),
  get('returnToURL')
)

export default getReturnToURL
