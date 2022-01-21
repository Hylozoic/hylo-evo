import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import gql from 'graphql-tag'
import { FETCH_POSTS } from 'store/constants'
import GroupViewPostsQueryFragment from 'graphql/fragments/GroupViewPostsQueryFragment'
import PostsQueryFragment from 'graphql/fragments/PostsQueryFragment'
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

const groupQuery = gql`
  query GroupQuery (
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
    $topic: ID,
    $withComments: Boolean = false
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
      ...GroupViewPostsQueryFragment
    }
  }
  ${GroupViewPostsQueryFragment}
`

const postsQuery = gql`
  query PostsQuery (
    $afterTime: Date,
    $beforeTime: Date,
    $boundingBox: [PointInput],
    $context: String,
    $filter: String,
    $first: Int,
    $groupSlugs: [String],
    $offset: Int,
    $order: String,
    $search: String,
    $sortBy: String,
    $topic: ID,
    $withComments: Boolean = false
  ) {
    ...PostsQueryFragment
  }

  ${PostsQueryFragment}
`

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
