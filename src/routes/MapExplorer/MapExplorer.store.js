import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { FETCH_MEMBERS_MAP, FETCH_POSTS_MAP, FETCH_GROUPS_MAP, SAVE_SEARCH, FETCH_SAVED_SEARCHES, DELETE_SAVED_SEARCH } from 'store/constants'
import { POST_TYPES } from 'store/models/Post'
import groupsQueryFragment from 'graphql/fragments/groupsQueryFragment'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
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
  group: {
    primaryColor: [201, 88, 172, 255],
    backgroundColor: 'rgba(201, 88, 172, 1.000)'
  }
}

export function formatBoundingBox (bbox) {
  return bbox ? [{ lng: bbox[0], lat: bbox[1] }, { lng: bbox[2], lat: bbox[3] }] : bbox
}

const groupPostsQuery = `query (
  $slug: String,
  $sortBy: String,
  $filter: String,
  $search: String,
  $topic: ID,
  $first: Int,
  $offset: Int,
  $boundingBox: [PointInput]
) {
  group(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
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
  $groupSlugs: [String]
  $offset: Int,
  $context: String,
  $search: String,
  $sortBy: String,
  $topic: ID
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

const groupMembersQuery = `query (
  $slug: String,
  $sortBy: String,
  $search: String,
  $boundingBox: [PointInput]
) {
  group(slug: $slug, updateLastViewed: true) {
    id
    slug
    name
    avatarUrl
    bannerUrl
    postCount
    ${membersFragment}
  }
}`

const groupsQuery = `query (
  $boundingBox: [PointInput],
  $context: String,
  $parentSlugs: [String],
  $search: String,
  $sortBy: String,
  $visibility: Int
) {
  ${groupsQueryFragment}
}`

// actions
export function fetchPosts ({ context, slug, sortBy, search, filter, topic, boundingBox, groupSlugs }) {
  var query, extractModel, getItems

  if (context === 'groups') {
    query = groupPostsQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (context === 'all' || context === 'public') {
    query = postsQuery
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS_MAP with context=${context} is not implemented`)
  }

  return {
    type: FETCH_POSTS_MAP,
    graphql: {
      query,
      variables: {
        boundingBox: formatBoundingBox(boundingBox),
        filter,
        groupSlugs,
        context,
        slug,
        sortBy,
        search,
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

export function fetchMembers ({ boundingBox, context, slug, sortBy, search, groupSlugs }) {
  var query, extractModel, getItems

  if (context === 'groups') {
    query = groupMembersQuery
    extractModel = 'Group'
    getItems = get('payload.data.group.members')
  } else if (context === 'all') {
    // query = allGroupsMembersQuery
    // extractModel = 'User'
    // getItems = get('payload.data.people')
    // No Members in All Groups Context, yet
    return { type: 'RETURN NO MEMBERS FOR ALL GROUPS' }
  } else if (context === 'public') {
    // No Members in Public Context, yet
    return { type: 'RETURN NO MEMBERS FOR PUBLIC' }
  } else {
    throw new Error(`FETCH_MEMBERS_MAP with context=${context} is not implemented`)
  }

  return {
    type: FETCH_MEMBERS_MAP,
    graphql: {
      query,
      variables: {
        slug,
        sortBy,
        search,
        groupSlugs,
        boundingBox: formatBoundingBox(boundingBox)
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

export function fetchGroups ({ boundingBox, context, groupSlugs, search, slug, sortBy }) {
  return {
    type: FETCH_GROUPS_MAP,
    graphql: {
      query: groupsQuery,
      variables: {
        boundingBox: formatBoundingBox(boundingBox),
        context,
        parentSlugs: groupSlugs,
        sortBy,
        search
      }
    },
    meta: {
      extractModel: 'Group',
      extractQueryResults: {
        getItems: get('payload.data.groups')
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

const getGroupsResults = makeGetQueryResults(FETCH_GROUPS_MAP)

export const getGroups = makeQueryResultsModelSelector(
  getGroupsResults,
  'Group'
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
