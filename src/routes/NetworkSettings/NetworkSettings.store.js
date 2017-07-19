// import { combineReducers } from 'redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import orm from 'store/models'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import { get, includes, isEmpty } from 'lodash/fp'

export const MODULE_NAME = 'NetworkSettings'

// Constants
export const FETCH_NETWORK_SETTINGS = `${MODULE_NAME}/FETCH_NETWORK_SETTINGS`
export const UPDATE_NETWORK_SETTINGS = `${MODULE_NAME}/UPDATE_NETWORK_SETTINGS`
export const FETCH_MODERATORS = `${MODULE_NAME}/FETCH_MODERATORS`
export const FETCH_COMMUNITIES = `${MODULE_NAME}/FETCH_COMMUNITIES`
export const SET_MODERATORS_PAGE = `${MODULE_NAME}/SET_MODERATORS_PAGE`
export const SET_COMMUNITIES_PAGE = `${MODULE_NAME}/SET_COMMUNITIES_PAGE`

export const PAGE_SIZE = 10

const defaultState = {
  moderatorsPage: 0,
  communitiesPage: 0
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_MODERATORS_PAGE:
      return {
        ...state,
        moderatorsPage: payload
      }
    case SET_COMMUNITIES_PAGE:
      return {
        ...state,
        communitiesPage: payload
      }
    default:
      return state
  }
}

// Action Creators

export function setModeratorsPage (page) {
  return {
    type: SET_MODERATORS_PAGE,
    payload: page
  }
}

export function setCommunitiesPage (page) {
  return {
    type: SET_COMMUNITIES_PAGE,
    payload: page
  }
}

export function fetchNetworkSettings (slug, pageSize = PAGE_SIZE) {
  return {
    type: FETCH_NETWORK_SETTINGS,
    graphql: {
      query: `query ($slug: String) {
        network (slug: $slug) {
          id
          slug
          name
          description
          avatarUrl
          bannerUrl
          createdAt
          communities (first: ${pageSize}, sortBy: "name")  {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
          moderators (first: ${pageSize}, sortBy: "name") {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Network',
      page: 0
    }
  }
}

export function updateNetworkSettings (id, data) {
  return {
    type: UPDATE_NETWORK_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $data: NetworkInput) {
        updateNetwork(id: $id, data: $data) {
          id
        }
      }`,
      variables: {
        id, data
      }
    },
    meta: {
      id,
      data,
      optimistic: true
    }
  }
}

export function fetchModerators (slug, page) {
  const offset = page * PAGE_SIZE
  return {
    type: FETCH_MODERATORS,
    graphql: {
      query: `query ($slug: String, $offset: Int) {
        network (slug: $slug) {
          id
          moderators (first: ${PAGE_SIZE}, sortBy: "name", offset: $offset) {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug,
        offset
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page
    }
  }
}

export function orderFromSort (sortBy) {
  if (sortBy === 'name') return 'asc'
  return 'desc'
}

export function fetchCommunities ({slug, page, offset, sortBy = 'name', order, search, pageSize = PAGE_SIZE}) {
  offset = offset || page * pageSize
  order = order || orderFromSort(sortBy)
  return {
    type: FETCH_COMMUNITIES,
    graphql: {
      query: `query ($slug: String, $offset: Int, $sortBy: String, $order: String, $search: String) {
        network (slug: $slug) {
          id
          communities (first: ${pageSize}, sortBy: $sortBy, order: $order, offset: $offset, search: $search) {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug,
        offset,
        sortBy,
        order,
        search
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page
    }
  }
}

// Selectors
export const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { slug }) => slug,
  (session, slug) =>
    session.Network.safeGet({slug}))

export const getModeratorResults = makeGetQueryResults(FETCH_MODERATORS)
export const getModeratorsTotal = createSelector(
  getModeratorResults,
  get('total')
)
export const getModerators = ormCreateSelector(
  orm,
  state => state.orm,
  getModeratorResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export const getCommunitiesResults = makeGetQueryResults(FETCH_COMMUNITIES)
export const getCommunitiesTotal = createSelector(
  getCommunitiesResults,
  get('total')
)
export const getCommunitiesHasMore = createSelector(
  getCommunitiesResults,
  get('hasMore')
)
export const getCommunities = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunitiesResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Community.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export const getModeratorsPage = state => state[MODULE_NAME].moderatorsPage
export const getCommunitiesPage = state => state[MODULE_NAME].communitiesPage
