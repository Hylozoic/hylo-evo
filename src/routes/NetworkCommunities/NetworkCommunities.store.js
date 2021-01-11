// import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { FETCH_NETWORK_SETTINGS, orderFromSort } from 'routes/NetworkSettings/NetworkSettings.store'

export const MODULE_NAME = 'NetworkCommunities'

// Constants
export const SET_SEARCH = `${MODULE_NAME}/SET_SEARCH`
export const SET_SORT = `${MODULE_NAME}/SET_SORT`

// Reducer
const defaultState = {
  sort: 'num_members',
  search: ''
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search: payload
      }
    case SET_SORT:
      return {
        ...state,
        sort: payload
      }
    default:
      return state
  }
}

export function setSearch (search) {
  return {
    type: SET_SEARCH,
    payload: search
  }
}

export function setSort (sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

export function fetchNetwork (slug, sortBy) {
  const order = orderFromSort(sortBy)
  return {
    type: FETCH_NETWORK_SETTINGS,
    graphql: {
      query: `query ($slug: String, $sortBy: String, $order: String) {
        network (slug: $slug) {
          id
          slug
          name
          description
          avatarUrl
          bannerUrl
          createdAt
          memberCount
          communities (first: 20, sortBy: $sortBy, order: $order)  {
            total
            hasMore
            items {
              id
              name
              avatarUrl
              numMembers
            }
          }
        }
      }`,
      variables: {
        slug,
        sortBy,
        search: '',
        order
      }
    },
    meta: {
      extractModel: 'Network'
    }
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]

export const getNetwork = ormCreateSelector(
  orm,
  (state, { slug }) => slug,
  (session, slug) => {
    return session.Network.safeGet({ slug })
  }
)

export const getSort = createSelector(
  moduleSelector,
  (state, props) => state.sort
)

export const getSearch = createSelector(
  moduleSelector,
  (state, props) => state.search
)
