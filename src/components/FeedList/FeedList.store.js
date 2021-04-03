import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchPosts ({ context, slug, sortBy, offset, search, filter, topic }) {
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
        filter,
        first: 20,
        offset,
        context,
        search,
        slug,
        sortBy,
        topic
      }
    },
    meta: {
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}

const groupQuery = `query (
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $offset: Int,
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
    postCount
    ${groupViewPostsQueryFragment}
  }
}`

const postsQuery = `query (
  $boundingBox: [PointInput],
  $filter: String,
  $first: Int,
  $groupSlugs: [String],
  $offset: Int,
  $context: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
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
