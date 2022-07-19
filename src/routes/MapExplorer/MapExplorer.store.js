import { get, isEmpty } from 'lodash/fp'
import { createSelector } from 'reselect'
import {
  DELETE_SAVED_SEARCH,
  FETCH_SAVED_SEARCHES,
  SAVE_SEARCH
} from 'store/constants'
import { POST_TYPES } from 'store/models/Post'
import groupViewPostsQueryFragment from 'graphql/fragments/groupViewPostsQueryFragment'
import postsQueryFragment from 'graphql/fragments/postsQueryFragment'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

export const MODULE_NAME = 'MapExplorer'
export const FETCH_GROUPS_MAP = `${MODULE_NAME}/FETCH_GROUPS_MAP`
export const FETCH_MEMBERS_MAP = `${MODULE_NAME}/FETCH_MEMBERS_MAP`
export const FETCH_POSTS_MAP = `${MODULE_NAME}/FETCH_POSTS_MAP`
export const FETCH_POSTS_MAP_DRAWER = `${MODULE_NAME}/FETCH_POSTS_MAP_DRAWER`
export const STORE_CLIENT_FILTER_PARAMS = `${MODULE_NAME}/STORE_CLIENT_FILTER_PARAMS`
export const UPDATE_STATE = `${MODULE_NAME}/UPDATE_STATE`

export const SORT_OPTIONS = [
  { id: 'updated', label: 'Latest Activity' },
  { id: 'created', label: 'Post Date' },
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
    primaryColor: [128, 140, 155, 255],
    backgroundColor: 'rgba(128, 140, 155, 1.000)',
    map: true
  }
}

export function formatBoundingBox (bbox) {
  return bbox ? [{ lng: bbox[0], lat: bbox[1] }, { lng: bbox[2], lat: bbox[3] }] : bbox
}

const groupPostsQuery = (postsFragment) => `query (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput]
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
    avatarUrl
    bannerUrl
    postCount
    ${postsFragment}
  }
}`

const postsQuery = (postsFragment) => `query (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $context: String,
  $filter: String,
  $first: Int,
  $groupSlugs: [String]
  $isFulfilled: Boolean,
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID]
) {
  ${postsFragment}
}`

const membersFragment = `
  members(sortBy: $sortBy, order: "asc", boundingBox: $boundingBox, search: $search) {
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
  $boundingBox: [PointInput],
  $slug: String,
  $sortBy: String,
  $search: String
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
  groups(
    boundingBox: $boundingBox,
    context: $context,
    parentSlugs: $parentSlugs,
    search: $search,
    sortBy: $sortBy,
    visibility: $visibility
  ) {
    items {
      id
      avatarUrl
      description
      geoShape
      memberCount
      name
      slug
      locationObject {
        id
        addressNumber
        addressStreet
        bbox {
          lat
          lng
        }
        center {
          lat
          lng
        }
        city
        country
        fullText
        locality
        neighborhood
        region
      }
    }
  }
}`

// actions
export function fetchPostsForMap ({activePostsOnly = false, context, slug, sortBy, search, filter, topics, boundingBox, groupSlugs }) {
  var query, extractModel, getItems

  if (context === 'groups') {
    query = groupPostsQuery(`posts: viewPosts(
      activePostsOnly: $activePostsOnly,
      afterTime: $afterTime,
      beforeTime: $beforeTime,
      boundingBox: $boundingBox,
      filter: $filter,
      first: $first,
      isFulfilled: $isFulfilled,
      offset: $offset,
      order: $order,
      sortBy: $sortBy,
      search: $search,
      topic: $topic,
      topics: $topics
    ) {
      hasMore
      total
      items {
        id
        title
        type
        details
        createdAt
        updatedAt
        locationObject {
          center {
            lat
            lng
          }
        }
        topics {
          id
          name
        }
      }
    }`)
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (context === 'all' || context === 'public') {
    query = postsQuery(`posts(
      activePostsOnly: $activePostsOnly,
      afterTime: $afterTime,
      beforeTime: $beforeTime,
      boundingBox: $boundingBox,
      context: $context,
      filter: $filter,
      first: $first,
      groupSlugs: $groupSlugs,
      isFulfilled: $isFulfilled,
      offset: $offset,
      order: $order,
      sortBy: $sortBy,
      search: $search,
      topic: $topic,
      topics: $topics
    ) {
      hasMore
      total
      items {
        id
        title
        type
        details
        createdAt
        updatedAt
        locationObject {
          center {
            lat
            lng
          }
        }
        topics {
          id
          name
        }
      }
    }`)
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
        activePostsOnly,
        boundingBox: formatBoundingBox(boundingBox),
        context,
        filter,
        first: 500,
        groupSlugs,
        isFulfilled: false,
        slug,
        sortBy,
        search,
        topic: null,
        topics
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

export function fetchPostsForDrawer ({ activePostsOnly = false, context, currentBoundingBox, featureTypes, filter, groupSlugs, offset = 0, replace, slug, sortBy, search, topics }) {
  var query, extractModel, getItems

  if (context === 'groups') {
    query = groupPostsQuery(groupViewPostsQueryFragment)
    extractModel = 'Group'
    getItems = get('payload.data.group.posts')
  } else if (context === 'all' || context === 'public') {
    query = postsQuery(postsQueryFragment)
    extractModel = 'Post'
    getItems = get('payload.data.posts')
  } else {
    throw new Error(`FETCH_POSTS_MAP_DRAWER with context=${context} is not implemented`)
  }

  return {
    type: FETCH_POSTS_MAP_DRAWER,
    graphql: {
      query,
      variables: {
        activePostsOnly,
        boundingBox: formatBoundingBox(currentBoundingBox),
        context,
        filter,
        first: 10,
        groupSlugs,
        isFulfilled: false,
        offset,
        slug,
        sortBy,
        search,
        topic: null,
        topics: !isEmpty(topics) ? topics.map(t => t.id) : null,
        types: !isEmpty(featureTypes) ? Object.keys(featureTypes).filter(ft => featureTypes[ft]) : null
      }
    },
    meta: {
      extractModel,
      extractQueryResults: {
        getItems,
        replace
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
        boundingBox: formatBoundingBox(boundingBox),
        context,
        groupSlugs,
        search,
        slug,
        sortBy
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

export function fetchGroups ({ boundingBox, context, parentSlugs, search, slug, sortBy }) {
  return {
    type: FETCH_GROUPS_MAP,
    graphql: {
      query: groupsQuery,
      variables: {
        boundingBox: formatBoundingBox(boundingBox),
        context,
        parentSlugs,
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

export function updateState (params) {
  return {
    type: UPDATE_STATE,
    payload: Promise.resolve(params) // use promise so we can .then() after dispatching this action
  }
}

export function storeClientFilterParams (params) {
  return {
    type: STORE_CLIENT_FILTER_PARAMS,
    payload: Promise.resolve(params)
  }
}

// Selectors
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

const getPostsForMapResults = makeGetQueryResults(FETCH_POSTS_MAP)
const getPostsForDrawerResults = makeGetQueryResults(FETCH_POSTS_MAP_DRAWER)

export const getPostsForMap = makeQueryResultsModelSelector(getPostsForMapResults, 'Post')
export const getPostsForDrawer = makeQueryResultsModelSelector(getPostsForDrawerResults, 'Post')

export const getPostsForMapFilteredByType = createSelector(
  getPostsForMap,
  filterContentTypesSelector,
  (posts, filterContentTypes) => posts.filter(post => filterContentTypes[post.type])
)

export const getPostsForDrawerFilteredByType = createSelector(
  getPostsForDrawer,
  filterContentTypesSelector,
  (posts, filterContentTypes) => posts.filter(post => filterContentTypes[post.type])
)

export const getSearchedPostsForMap = createSelector(
  getPostsForMapFilteredByType,
  searchTextSelector,
  (posts, searchText) => {
    const trimmedText = searchText ? searchText.trim().toLowerCase() : ''
    if (trimmedText === '') return posts
    return posts.filter(post => {
      return post.title.toLowerCase().includes(trimmedText) ||
             post.details.toLowerCase().includes(trimmedText) ||
             post.topics.toModelArray().find(topic => topic.name.toLowerCase().includes(trimmedText))
    })
  }
)

export const getSearchedPostsForDrawer = createSelector(
  getPostsForDrawerFilteredByType,
  searchTextSelector,
  (posts, searchText) => {
    const trimmedText = searchText ? searchText.trim().toLowerCase() : ''
    if (trimmedText === '') return posts
    return posts.filter(post => {
      return post.title.toLowerCase().includes(trimmedText) ||
             post.details.toLowerCase().includes(trimmedText) ||
             post.topics.toModelArray().find(topic => topic.name.toLowerCase().includes(trimmedText))
    })
  }
)

export const getFilteredPostsForMap = createSelector(
  getSearchedPostsForMap,
  filterTopicsSelector,
  (posts, filterTopics) => {
    if (filterTopics.length === 0) return posts
    return posts.filter(post => {
      return post.topics.toModelArray().find(pt => filterTopics.find(ft => pt.name.toLowerCase() === ft.name.toLowerCase()))
    })
  }
)

export const getFilteredPostsForDrawer = createSelector(
  getSearchedPostsForDrawer,
  filterTopicsSelector,
  (posts, filterTopics) => {
    if (filterTopics.length === 0) return posts
    return posts.filter(post => {
      return post.topics.toModelArray().find(pt => filterTopics.find(ft => pt.name.toLowerCase() === ft.name.toLowerCase()))
    })
  }
)

export const getSortedFilteredPostsForDrawer = createSelector(
  getFilteredPostsForDrawer,
  sortBySelector,
  (posts, sortBy) => {
    return posts.sort((a, b) => sortBy === 'votes' ? b.votesTotal - a.votesTotal
      : sortBy === 'updated' ? new Date(b.updatedAt) - new Date(a.updatedAt)
        : new Date(b.createdAt) - new Date(a.createdAt))
  }
)

export const getCurrentTopics = createSelector(
  getFilteredPostsForMap,
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

const getMemberResults = makeGetQueryResults(FETCH_MEMBERS_MAP)

export const getMembers = makeQueryResultsModelSelector(
  getMemberResults,
  'Person'
)

export const getMembersFilteredByType = createSelector(
  getMembers,
  filterContentTypesSelector,
  (members, filterContentTypes) => {
    return filterContentTypes['member'] ? members : []
  }
)

export const getMembersFilteredBySearch = createSelector(
  getMembersFilteredByType,
  searchTextSelector,
  (members, searchText) => {
    const searchLower = isEmpty(searchText) ? null : searchText.toLowerCase()
    return searchLower ? members.filter(m => m.name.toLowerCase().includes(searchLower) ||
                            (m.tagline && m.tagline.toLowerCase().includes(searchLower)) ||
                            (m.skills && m.skills.toModelArray().find(s => s.name.toLowerCase() === searchLower)))
      : members
  }
)

export const getMembersFilteredByTopics = createSelector(
  getMembersFilteredBySearch,
  filterTopicsSelector,
  (members, filterTopics) => {
    return isEmpty(filterTopics) ? members
      : members.filter(m => filterTopics.find(ft => (m.tagline && m.tagline.toLowerCase().includes(ft.name.toLowerCase())) ||
                                                    (m.skills && m.skills.toModelArray().find(s => s.name.toLowerCase() === ft.name.toLowerCase()))
      ))
  }
)

const getGroupsResults = makeGetQueryResults(FETCH_GROUPS_MAP)

export const getGroups = makeQueryResultsModelSelector(
  getGroupsResults,
  'Group'
)

export const getGroupsFilteredByType = createSelector(
  getGroups,
  filterContentTypesSelector,
  (groups, filterContentTypes) => {
    return filterContentTypes['group'] ? groups : []
  }
)

export const getGroupsFilteredBySearch = createSelector(
  getGroupsFilteredByType,
  searchTextSelector,
  (groups, searchText) => {
    const searchLower = isEmpty(searchText) ? false : searchText.toLowerCase()
    return searchLower ? groups.filter(g => g.name.toLowerCase().includes(searchLower) ||
                           (g.description && g.description.toLowerCase().includes(searchLower)))
      : groups
  }
)

export const getGroupsFilteredByTopics = createSelector(
  getGroupsFilteredBySearch,
  filterTopicsSelector,
  (groups, filterTopics) => {
    return isEmpty(filterTopics)
      ? groups
      : groups.filter(g => filterTopics.find(ft => g.name.toLowerCase().includes(ft.name.toLowerCase()) ||
                                                   (g.description.toLowerCase() && g.description.includes(ft.name.toLowerCase())))
      )
  }
)

/* ***** Reducer ***** */
const DEFAULT_STATE = {
  baseLayerStyle: null,
  centerLocation: null,
  totalBoundingBoxLoaded: null,
  zoom: 0,
  clientFilterParams: {
    currentBoundingBox: null,
    featureTypes: Object.keys(FEATURE_TYPES).filter(t => FEATURE_TYPES[t].map).reduce((types, type) => { types[type] = true; return types }, {}),
    search: '',
    sortBy: SORT_OPTIONS[0].id,
    topics: []
  },
  searches: []
}

export default function (state = DEFAULT_STATE, action) {
  if (action.type === UPDATE_STATE) {
    return {
      ...state,
      ...action.payload
    }
  }
  if (action.type === STORE_CLIENT_FILTER_PARAMS) {
    return {
      ...state,
      clientFilterParams: {
        ...state.clientFilterParams,
        ...action.payload,
        featureTypes: { ...state.clientFilterParams.featureTypes, ...(action.payload.featureTypes || {}) }
      }
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
