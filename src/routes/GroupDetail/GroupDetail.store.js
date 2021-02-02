import { FETCH_JOIN_REQUESTS } from 'store/constants'
import fetchJoinRequestsQuery from 'graphql/queries/fetchJoinRequestsQuery'

export const MODULE_NAME = 'GroupDetail'
export const CREATE_JOIN_REQUEST = `${MODULE_NAME}/CREATE_JOIN_REQUEST`
export const CREATE_JOIN_REQUEST_PENDING = `${MODULE_NAME}/CREATE_JOIN_REQUEST_PENDING`

export const JOIN_GROUP = `${MODULE_NAME}/JOIN_GROUP`
export const JOIN_GROUP_PENDING = `${MODULE_NAME}/JOIN_GROUP_PENDING`

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action
  if (error) return state
  switch (type) {
    case FETCH_JOIN_REQUESTS:
      const requests = payload.data.joinRequests.items || []
      return requests.filter(r => r.status === 0)
    default:
      return state
  }
}

export function fetchJoinRequests (groupId) {
  return {
    type: FETCH_JOIN_REQUESTS,
    graphql: {
      query: fetchJoinRequestsQuery,
      variables: { groupId }
    },
    meta: {
      groupId
    }
  }
}

export function joinGroup (groupId, userId) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: `mutation ($groupId: ID, $userId: ID) {
        joinGroup(groupId: $groupId, userId: $userId) {
          membership {
            id
            role
            group {
              id
              name
              slug
            }
          }
          error
        }
      }`,
      variables: {
        groupId,
        userId
      }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}

export function createJoinRequest (groupId, userId) {
  return {
    type: CREATE_JOIN_REQUEST,
    graphql: {
      query: `mutation ($groupId: ID, $userId: ID) {
        createJoinRequest(groupId: $groupId, userId: $userId) {
          request {
            id
            user {
              id
            }
            group {
              id
            }
            createdAt
            updatedAt
            status
          }
        }
      }`,
      variables: { groupId, userId }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}