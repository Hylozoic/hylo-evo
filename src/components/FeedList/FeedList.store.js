import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import publicPostsQueryFragment from 'graphql/fragments/publicPostsQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
export const MODULE_NAME = 'FeedList'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchPosts ({ subject, slug, sortBy, offset, search, filter, topic }) {
  var query, extractModel, getItems

  if (subject === 'group') {
    query = groupQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (subject === 'all-groups') {
    query = allGroupsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else if (subject === 'public-groups') {
    query = publicPostsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        slug,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
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
  $slug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput]
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
    ${postsQueryFragment}
  }
}`

const allGroupsQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int
  $boundingBox: [PointInput]
) {
  ${postsQueryFragment}
}`

const publicPostsQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput],
  $groupSlugs: [String]
) {
  ${publicPostsQueryFragment}
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
