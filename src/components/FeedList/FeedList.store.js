import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import { FETCH_POSTS } from 'store/constants'
import orm from 'store/models'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
import getRouteParam from 'store/selectors/getRouteParam'

export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchPosts ({ activePostsOnly, afterTime, beforeTime, context, filter, offset, order, search, slug, sortBy, topic, topics, types }) {
  var query, extractModel, getItems

  if (context === 'groups') {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (context === 'all' || context === 'public') {
    query = postsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS with context=${context} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        activePostsOnly,
        afterTime,
        beforeTime,
        context,
        filter,
        first: 20,
        offset,
        order,
        search,
        slug,
        sortBy,
        topic,
        topics,
        types
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

const groupQuery = `query GroupPostsQuery (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $slug: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
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
    postCount
    ${groupViewPostsQueryFragment}
  }
}`

const postsQuery = `query PostsQuery (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $context: String,
  $filter: String,
  $first: Int,
  $groupSlugs: [String],
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
) {
  ${postsQueryFragment}
}`

export function storeFetchPostsParam (props) {
  return {
    type: STORE_FETCH_POSTS_PARAM,
    payload: props
  }
}

// selectors
const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

export const getCustomView = ormCreateSelector(
  orm,
  (session, props) => getRouteParam('customViewId', session, props),
  (session, id) => session.CustomView.safeGet({ id })
)

// reducer
export default function (state = {}, action) {
  if (action.type === STORE_FETCH_POSTS_PARAM) {
    return {
      ...state,
      fetchPostsParam: action.payload
    }
  }
  return state
}
