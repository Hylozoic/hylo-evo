// import { combineReducers } from 'redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'NetworkSettings'

// Constants
export const FETCH_NETWORK_SETTINGS = `${MODULE_NAME}/FETCH_NETWORK_SETTINGS`

// Action Creators
export function fetchNetworkSettings (slug) {
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
          communities (first: 20)  {
            total
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
          moderators (first: 20) {
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
      extractModel: 'Network'
    }
  }
}

// Reducer
const defaultState = {
  example: 'example value'
}

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    case FETCH_NETWORK_SETTINGS:
      return {example: 'fetched example'}
    default:
      return state
  }
}

// Selectors
export const getNetwork = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { slug }) => slug,
  (session, slug) =>
    session.Network.safeGet({slug}))
