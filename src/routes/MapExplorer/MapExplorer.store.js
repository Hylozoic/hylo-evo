import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import bboxPolygon from '@turf/bbox-polygon'
import booleanWithin from '@turf/boolean-within'
import { point } from '@turf/helpers'
import { FETCH_POSTS_MAP } from 'store/constants'
import orm from 'store/models/index'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

export const MODULE_NAME = 'MapExplorer'
export const STORE_FETCH_POSTS_PARAM = `${MODULE_NAME}/STORE_FETCH_POSTS_PARAM`

// actions
export function fetchPosts ({ subject, slug, networkSlug, sortBy, offset, search, filter, topic, boundingBox }) {
  var query, extractModel, getItems

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
    getItems = get('payload.data.community.posts')
  } else if (subject === 'network') {
    query = networkQuery
    extractModel = 'Network'
    getItems = get('payload.data.network.posts')
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS_MAP with subject=${subject} is not implemented`)
  }
  return {
    type: FETCH_POSTS_MAP,
    graphql: {
      query,
      variables: {
        slug,
        networkSlug,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
        topic,
        boundingBox
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

const communityQuery = `query (
  $slug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput]
) {
  community(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
    avatarUrl
    bannerUrl
    postCount
    ${postsQueryFragment}
  }
}`

const networkQuery = `query (
  $networkSlug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput]
) {
  network(slug: $networkSlug) {
    id
    ${postsQueryFragment}
  }
}`

const allCommunitiesQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $boundingBox: [PointInput]
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
export const boundingBoxSelector = (state) => {
  return state.MapExplorer.fetchPostsParam ? state.MapExplorer.fetchPostsParam.boundingBox : null
}

const getPostResults = makeGetQueryResults(FETCH_POSTS_MAP)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

export const getPostsByBoundingBox = ormCreateSelector(
  orm,
  state => state.orm,
  state => boundingBoxSelector(state),
  getPosts,
  (session, boundingBox, posts) => {
    if (!boundingBox) {
      return posts
    }

    const bbox = bboxPolygon([boundingBox[0].lng, boundingBox[0].lat, boundingBox[1].lng, boundingBox[1].lat])
    return posts.filter(post => {
      const locationObject = post.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
  }
)

// export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

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
