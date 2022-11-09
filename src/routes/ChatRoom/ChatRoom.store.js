import { FETCH_TOPIC, FETCH_GROUP_TOPIC, FETCH_POSTS } from 'store/constants'
import { get, includes, isEmpty } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const MODULE_NAME = 'ChatRoom'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

export function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: `query ($groupSlug: String, $topicName: String) {
        groupTopic(groupSlug: $groupSlug, topicName: $topicName) {
          id
          followersTotal
          lastReadPostId
          postsTotal
          group {
            id
          }
          topic {
            id
            name
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
export function fetchPosts ({ activePostsOnly, afterTime, beforeTime, collectionToFilterOut, context, cursor, filter, first, forCollection, offset, order, search, slug, sortBy, topic, topics, types }) {
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
        cursor,
        filter,
        first: first || 35,
        forCollection,
        offset,
        order,
        search,
        slug,
        sortBy: 'id',
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
    ${groupViewPostsQueryFragment(false)}
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

export const getPosts = ormCreateSelector(
  orm,
  getPostResults,
  (session, results) => {
    if (isEmpty(results)) return null
    if (isEmpty(results.ids)) return []
    return session.Post.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(p => Number(p.id))
      .toModelArray()
      .map(p => presentPost(p))
  }
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))
export const getTotalPosts = createSelector(getPostResults, get('total'))

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
