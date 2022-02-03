import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_GROUPS } from 'store/constants'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchGroups ({ afterTime, beforeTime, filter, offset, order, search, slug, sortBy, topic }) {
  var query, extractModel, getItems

  query = groupQuery
  extractModel = 'Group'
  getItems = get('payload.data.group')

  return {
    type: FETCH_GROUPS,
    graphql: {
      query,
      variables: {
        afterTime,
        beforeTime,
        filter,
        first: 20,
        offset,
        order,
        search,
        slug,
        sortBy,
        topic
      }
    },
    meta: {
      slug,
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query (
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $offset: Int,
  $order: String,
  $search: String,
  $slug: String,
  $sortBy: String,
  $topic: ID
) {
  group(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
    locationObject {
      center {
        lat
        lng
      }
    }
    avatarUrl
    bannerUrl
  }
}`
