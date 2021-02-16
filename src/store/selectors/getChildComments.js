import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_CHILD_COMMENTS } from 'store/constants'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const getCommentResults = makeGetQueryResults(FETCH_CHILD_COMMENTS)

export const getHasMoreChildComments = createSelector(
  getCommentResults,
  get('hasMore')
)

export const getTotalChildComments = createSelector(
  getCommentResults,
  get('total')
)
