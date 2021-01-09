import {
  FETCH_JOIN_REQUESTS,
  FETCH_JOIN_REQUESTS_PENDING,
  ACCEPT_JOIN_REQUEST,
  DECLINE_JOIN_REQUEST
} from 'store/constants'
import fetchJoinRequestsQuery from 'graphql/queries/fetchJoinRequestsQuery'
export const MODULE_NAME = 'MembershipRequestsTab'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_JOIN_REQUESTS_PENDING:
      return null
    case FETCH_JOIN_REQUESTS:
      const requests = payload.data.joinRequests.items || []
      return requests.filter(r => r.status === 0)
    case ACCEPT_JOIN_REQUEST:
      const { acceptJoinRequest } = payload.data
      return (state || []).filter(item => item.id !== acceptJoinRequest.id)
    case DECLINE_JOIN_REQUEST:
      const { declineJoinRequest } = payload.data
      return (state || []).filter(item => item.id !== declineJoinRequest.id)
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

export function acceptJoinRequest (joinRequestId, groupId, userId, moderatorId) {
  return {
    type: ACCEPT_JOIN_REQUEST,
    graphql: {
      query: `mutation ($joinRequestId: ID, $groupId: ID, $userId: ID, $moderatorId: ID) {
        acceptJoinRequest(joinRequestId: $joinRequestId, groupId: $groupId, userId: $userId, moderatorId: $moderatorId) {
          id
        }
      }`,
      variables: { joinRequestId, groupId, userId, moderatorId }
    },
    meta: {
      joinRequestId,
      optimistic: true
    }
  }
}

export function declineJoinRequest (joinRequestId) {
  return {
    type: DECLINE_JOIN_REQUEST,
    graphql: {
      query: `mutation ($joinRequestId: ID) {
        declineJoinRequest(joinRequestId: $joinRequestId) {
          id
        }
      }`,
      variables: { joinRequestId }
    },
    meta: {
      joinRequestId,
      optimistic: true
    }
  }
}
