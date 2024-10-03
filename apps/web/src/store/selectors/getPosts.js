import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_POSTS } from 'store/constants'
import {
  makeGetQueryResults,
  makeQueryResultsModelSelector
} from 'store/reducers/queryResults'

export const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))
export const getTotalPosts = createSelector(getPostResults, get('total'))
