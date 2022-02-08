import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchPosts ({ afterTime, beforeTime, context, filter, offset, order, search, slug, sortBy, topic }) {
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
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $slug: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID]
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

const postsQuery = `query (
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
  $topics: [ID]
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
