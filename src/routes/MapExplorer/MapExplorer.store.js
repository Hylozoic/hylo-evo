import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_MEMBERS_MAP, FETCH_POSTS_MAP, FETCH_COMMUNITIES_MAP, SAVE_SEARCH, FETCH_SAVED_SEARCHES, DELETE_SAVED_SEARCH } from 'store/constants'
import { POST_TYPES } from 'store/models/Post'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import publicPostsQueryFragment from 'graphql/fragments/publicPostsQueryFragment'
import publicCommunitiesQueryFragment from 'graphql/fragments/publicCommunitiesQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

export const MODULE_NAME = 'MapExplorer'
export const STORE_FETCH_PARAMS = `${MODULE_NAME}/STORE_FETCH_PARAMS`
export const STORE_CLIENT_FILTER_PARAMS = `${MODULE_NAME}/STORE_CLIENT_FILTER_PARAMS`

export const SORT_OPTIONS = [
  { id: 'updated', label: 'Latest' },
  { id: 'votes', label: 'Popular' }
]

export const FEATURE_TYPES = {
  ...POST_TYPES,
  member: {
    primaryColor: [201, 88, 172, 255],
    backgroundColor: 'rgba(201, 88, 172, 1.000)',
    map: true
  },
  community: {
    primaryColor: [201, 88, 172, 255],
    backgroundColor: 'rgba(201, 88, 172, 1.000)'
  }
}

export function formatBoundingBox (bbox) {
  return bbox ? [{ lng: bbox[0], lat: bbox[1] }, { lng: bbox[2], lat: bbox[3] }] : bbox
}

const communityPostsQuery = `query (
  $slug: String,
  $sortBy: String,
  $filter: String,
  $search: String,
  $topic: ID,
  $first: Int,
  $offset: Int,
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

const networkPostsQuery = `query (
  $networkSlug: String,
  $sortBy: String,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $offset: Int,
  $boundingBox: [PointInput]
) {
  network(slug: $networkSlug) {
    id
    ${postsQueryFragment}
  }
}`

const allCommunitiesPostsQuery = `query (
  $sortBy: String,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $offset: Int,
  $boundingBox: [PointInput]
) {
  ${postsQueryFragment}
}`

const membersFragment = `
  members(sortBy: $sortBy, order: "desc", boundingBox: $boundingBox, search: $search) {
    items {
      id
      name
      avatarUrl
      tagline
      locationObject {
        center {
          lat
          lng
        }
      }
      skills {
        hasMore
        items {
          id
          name
        }
      }
    }
  }
`

const communityMembersQuery = `query (
  $slug: String,
  $sortBy: String,
  $search: String,
  $boundingBox: [PointInput]
) {
  community(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
    avatarUrl
    bannerUrl
    postCount
    ${membersFragment}
  }
}`

const networkMembersQuery = `query (
  $networkSlug: String,
  $sortBy: String,
  $search: String,
  $boundingBox: [PointInput]
) {
  network(slug: $networkSlug) {
    id
    ${membersFragment}
  }
}`

const publicPostsQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: ID,
  $first: Int,
  $networkSlugs: [String]
  $boundingBox: [PointInput]
) {
  ${publicPostsQueryFragment}
}`

const publicCommunitiesQuery = `query (
  $sortBy: String,
  $search: String,
  $boundingBox: [PointInput],
  $networkSlugs: [String]
) {
  ${publicCommunitiesQueryFragment}
}`

// actions
export function fetchPosts ({ subject, slug, networkSlug, networkSlugs, sortBy, search, filter, topic, boundingBox, isPublic }) {
  var query, extractModel, getItems

  if (subject === 'community') {
    query = communityPostsQuery
    extractModel = 'Community'
    getItems = get('payload.data.community.posts')
  } else if (subject === 'network') {
    query = networkPostsQuery
    extractModel = 'Network'
    getItems = get('payload.data.network.posts')
  } else if (subject === 'all') {
    query = allCommunitiesPostsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else if (subject === 'public') {
    query = publicPostsQuery
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
        sortBy,
        search,
        filter,
        topic,
        boundingBox: formatBoundingBox(boundingBox),
        networkSlug,
        networkSlugs,
        isPublic
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

export function fetchMembers ({ boundingBox, subject, slug, networkSlug, sortBy, search, isPublic }) {
  var query, extractModel, getItems

  if (subject === 'community') {
    query = communityMembersQuery
    extractModel = 'Community'
    getItems = get('payload.data.community.members')
  } else if (subject === 'network') {
    query = networkMembersQuery
    extractModel = 'Network'
    getItems = get('payload.data.network.members')
  } else if (subject === 'all') {
    // query = allCommunitiesMembersQuery
    // extractModel = 'User'
    // getItems = get('payload.data.people')
    // No Members in All Communities Context, yet
    return { type: 'RETURN NO MEMBERS FOR ALL COMMUNITIES' }
  } else if (subject === 'public') {
    // No Members in Public Context, yet
    return { type: 'RETURN NO MEMBERS FOR PUBLIC' }
  } else {
    throw new Error(`FETCH_MEMBERS_MAP with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_MEMBERS_MAP,
    graphql: {
      query,
      variables: {
        slug,
        networkSlug,
        sortBy,
        search,
        boundingBox: formatBoundingBox(boundingBox),
        isPublic
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

export function fetchPublicCommunities ({ boundingBox, subject, sortBy, search, networkSlugs, isPublic }) {
  var query, extractModel, getItems

  if (subject === 'public') {
    query = publicCommunitiesQuery
    extractModel = 'Community'
    getItems = get('payload.data.communities')
  } else if (subject === 'community') {
    return { type: 'RETURN NULL FOR COMMUNITY' }
  } else if (subject === 'network') {
    return { type: 'RETURN NULL FOR NETWORK' }
  } else if (subject === 'all') {
    return { type: 'RETURN NULL FOR ALL COMMUNITIES' }
  } else {
    throw new Error(`FETCH_COMMUNITIES_MAP with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_COMMUNITIES_MAP,
    graphql: {
      query,
      variables: {
        sortBy,
        search,
        boundingBox: formatBoundingBox(boundingBox),
        networkSlugs,
        isPublic
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

export function storeFetchParams (params) {
  return {
    type: STORE_FETCH_PARAMS,
    payload: params
  }
}

export function storeClientFilterParams (params) {
  return {
    type: STORE_CLIENT_FILTER_PARAMS,
    payload: params
  }
}

// selectors
export const boundingBoxSelector = (state) => {
  return state.MapExplorer.fetchParamS ? state.MapExplorer.fetchParamS.boundingBox : null
}

export const filterContentTypesSelector = (state) => {
  return state.MapExplorer.clientFilterParams.featureTypes
}

export const searchTextSelector = (state) => {
  return state.MapExplorer.clientFilterParams.search
}

export const filterTopicsSelector = (state) => {
  return state.MapExplorer.clientFilterParams.topics
}

export const sortBySelector = (state) => {
  return state.MapExplorer.clientFilterParams.sortBy
}

const getPostResults = makeGetQueryResults(FETCH_POSTS_MAP)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

export const getPostsFilteredByType = createSelector(
  getPosts,
  filterContentTypesSelector,
  (posts, filterContentTypes) => posts.filter(post => filterContentTypes[post.type])
)

export const getSearchedPosts = createSelector(
  getPostsFilteredByType,
  searchTextSelector,
  (posts, searchText) => {
    const trimmedText = searchText ? searchText.trim() : ''
    if (trimmedText === '') return posts
    return posts.filter(post => {
      return post.title.toLowerCase().includes(searchText) ||
             post.details.toLowerCase().includes(searchText) ||
             post.topics.toModelArray().find(topic => topic.name.includes(searchText))
    })
  }
)

export const getFilteredPosts = createSelector(
  getSearchedPosts,
  filterTopicsSelector,
  (posts, filterTopics) => {
    if (filterTopics.length === 0) return posts
    return posts.filter(post => {
      return post.topics.toModelArray().find(pt => filterTopics.find(ft => pt.name === ft.name))
    })
  }
)

export const getSortedFilteredPosts = createSelector(
  getFilteredPosts,
  sortBySelector,
  (posts, sortBy) => {
    // TODO: use createdAt or the same updatedAt which includes comments that is used in the stream?
    return posts.sort((a, b) => sortBy === 'votes' ? b.votesTotal - a.votesTotal : new Date(b.createdAt) - new Date(a.createdAt))
  }
)

const getMemberResults = makeGetQueryResults(FETCH_MEMBERS_MAP)

export const getMembers = makeQueryResultsModelSelector(
  getMemberResults,
  'Person'
)

export const getSortedFilteredMembers = createSelector(
  getMembers,
  filterContentTypesSelector,
  sortBySelector,
  (members, filterContentTypes, sortBy) => {
    return filterContentTypes['member'] ? members : []
  }
)

export const getCurrentTopics = createSelector(
  getFilteredPosts,
  (posts) => {
    const topics = (posts ? posts.reduce((topics, post) => {
      post.topics.toModelArray().forEach((topic) => {
        const count = topics[topic.name] ? topics[topic.name].count + 1 : 1
        topics[topic.name] = { count, id: topic.id }
      })
      return topics
    }, {}) : {})
    const orderedTopics = []
    Object.keys(topics).forEach(key => {
      orderedTopics.push({ 'id': topics[key].id, 'name': key, 'count': topics[key].count })
    })
    return orderedTopics.sort((a, b) => b.count - a.count)
  }
)

const getPublicCommunitiesResults = makeGetQueryResults(FETCH_COMMUNITIES_MAP)

export const getPublicCommunities = makeQueryResultsModelSelector(
  getPublicCommunitiesResults,
  'Community'
)

// export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

// reducer
const DEFAULT_STATE = {
  clientFilterParams: {
    featureTypes: Object.keys(FEATURE_TYPES).filter(t => FEATURE_TYPES[t].map).reduce((types, type) => { types[type] = true; return types }, {}),
    search: '',
    sortBy: SORT_OPTIONS[0].id,
    topics: []
  },
  fetchParams: {
    boundingBox: null
  }
}

export default function (state = DEFAULT_STATE, action) {
  if (action.type === STORE_FETCH_PARAMS) {
    return {
      ...state,
      fetchParams: action.payload
    }
  }
  if (action.type === STORE_CLIENT_FILTER_PARAMS) {
    return {
      ...state,
      clientFilterParams: { ...state.clientFilterParams, ...action.payload, featureTypes: action.payload.featureTypes ? { ...action.payload.featureTypes } : state.clientFilterParams.featureTypes }
    }
  }
  if (action.type === FETCH_SAVED_SEARCHES) {
    return {
      ...state,
      searches: action.payload.data.savedSearches.items
    }
  }
  if (action.type === SAVE_SEARCH) {
    return {
      ...state,
      searches: state.searches.concat(action.payload.data.createSavedSearch)
    }
  }
  if (action.type === DELETE_SAVED_SEARCH) {
    return {
      ...state,
      searches: state.searches.filter(s => s.id !== action.payload.data.deleteSavedSearch)
    }
  }
  return state
}
