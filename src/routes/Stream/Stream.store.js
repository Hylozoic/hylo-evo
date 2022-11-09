import { FETCH_TOPIC, FETCH_GROUP_TOPIC, FETCH_POSTS } from 'store/constants'
import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import orm from 'store/models'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
import getRouteParam from 'store/selectors/getRouteParam'

export const MODULE_NAME = 'Stream'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

export function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: `query ($groupSlug: String, $topicName: String) {
        groupTopic(groupSlug: $groupSlug, topicName: $topicName) {
          id
          postsTotal
          followersTotal
          topic {
            id
            name
          }
          group {
            id
          }
        }
      }`,
      variables: {
        groupSlug,
        topicName
      }
    },
    meta: {
      extractModel: 'GroupTopic'
    }
  }
}

export function fetchTopic (name, id) {
  return {
    type: FETCH_TOPIC,
    graphql: {
      query: `query ($name: String, $id: ID) {
        topic(name: $name, id: $id) {
          id
          name
          postsTotal
          followersTotal
        }
      }`,
      variables: {
        name,
        id
      }
    },
    meta: {
      extractModel: 'Topic'
    }
  }
}

// actions
export function fetchPosts ({ activePostsOnly, afterTime, beforeTime, collectionToFilterOut, context, filter, first, forCollection, offset, order, search, slug, sortBy, topic, topics, types }) {
  let query, extractModel, getItems

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
        collectionToFilterOut,
        context,
        filter,
        first: first || 20,
        forCollection,
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
  $collectionToFilterOut: ID,
  $cursor: ID,
  $filter: String,
  $first: Int,
  $forCollection: ID,
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
    ${groupViewPostsQueryFragment(true)}
  }
}`

const postsQuery = `query PostsQuery (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $collectionToFilterOut: ID,
  $context: String,
  $cursor: ID,
  $filter: String,
  $first: Int,
  $forCollection: ID,
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
