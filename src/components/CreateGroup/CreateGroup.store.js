import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = `CreateGroup`
export const ADD_GROUP_NAME = `${MODULE_NAME}/ADD_GROUP_NAME`
export const ADD_GROUP_DOMAIN = `${MODULE_NAME}/ADD_GROUP_DOMAIN`
export const ADD_GROUP_PRIVACY = `${MODULE_NAME}/ADD_GROUP_PRIVACY`
export const ADD_PARENT_IDS = `${MODULE_NAME}/ADD_PARENT_IDS`
export const CREATE_GROUP = `${MODULE_NAME}/CREATE_GROUP`

export const FETCH_GROUP_EXISTS = `${MODULE_NAME}/FETCH_GROUP_EXISTS`

const defaultState = {}

export default function reducer (state = defaultState, action) {
  if (action.type === ADD_GROUP_NAME) {
    return { ...state, name: action.payload }
  }
  if (action.type === ADD_GROUP_DOMAIN) {
    return { ...state, domain: action.payload }
  }
  if (action.type === ADD_GROUP_PRIVACY) {
    return { ...state, privacy: action.payload }
  }
  if (action.type === ADD_PARENT_IDS) {
    return { ...state, parentIds: action.payload }
  }
  if (action.type === FETCH_GROUP_EXISTS) {
    return { ...state, slugExists: action.payload.data.groupExists.exists }
  }
  if (action.type === CREATE_GROUP) {
    if (!action.error) {
      return defaultState
    }
  }
  return state
}

export function addGroupName (name) {
  return {
    type: ADD_GROUP_NAME,
    payload: name
  }
}

export function addGroupPrivacy (privacy) {
  return {
    type: ADD_GROUP_PRIVACY,
    payload: privacy
  }
}

export function addGroupDomain (domain) {
  return {
    type: ADD_GROUP_DOMAIN,
    payload: domain
  }
}

export function addParentIds (parentIds) {
  return {
    type: ADD_PARENT_IDS,
    payload: parentIds
  }
}

export function fetchGroupExists (slug) {
  return {
    type: FETCH_GROUP_EXISTS,
    graphql: {
      query: `
        query ($slug: String) {
          groupExists (slug: $slug) {
            exists
          }
        }
      `,
      variables: {
        slug
      }
    }
  }
}

export function createGroup (name, slug, parentIds) {
  const data = {
    name,
    slug,
    parentIds
  }

  return {
    type: CREATE_GROUP,
    graphql: {
      query: `mutation ($data: GroupInput) {
        createGroup(data: $data) {
          id
          hasModeratorRole
          group {
            id
            name
            slug
            parentGroups {
              items {
                id
              }
            }
          }
          person {
            id
          }
        }
      }
      `,
      variables: {
        data
      }
    },
    meta: {
      extractModel: 'Membership',
      ...data,
      analytics: AnalyticsEvents.GROUP_CREATED
    }
  }
}

export const getParents = ormCreateSelector(
  orm,
  (state, { parentIds }) => parentIds,
  (session, parentIds) => {
    return parentIds && parentIds.length > 0 ? session.Group.filter(g => parentIds.includes(g.id)).toModelArray() : []
  }
)
