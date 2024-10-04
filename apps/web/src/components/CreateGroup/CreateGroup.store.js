import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { AnalyticsEvents } from 'hylo-shared'

export const MODULE_NAME = 'CreateGroup'
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

export function createGroup (data) {
  return {
    type: CREATE_GROUP,
    graphql: {
      query: `mutation ($data: GroupInput) {
        createGroup(data: $data) {
          id
          name
          purpose
          slug
          parentGroups {
            items {
              id
            }
          }
          memberships {
            items {
              id
              person {
                id
                membershipCommonRoles {
                  items {
                    id
                    groupId
                    commonRoleId
                    userId
                  }
                }
              }
              settings {
                agreementsAcceptedAt
                joinQuestionsAnsweredAt
                sendEmail
                showJoinForm
                sendPushNotifications
              }
            }
          }
        }
      }
      `,
      variables: {
        data
      }
    },
    meta: {
      extractModel: 'Group',
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
