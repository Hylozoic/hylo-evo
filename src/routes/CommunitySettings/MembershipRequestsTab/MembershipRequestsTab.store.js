import {
  FETCH_JOIN_REQUESTS,
  ACCEPT_JOIN_REQUEST,
  DECLINE_JOIN_REQUEST
} from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
export const MODULE_NAME = 'MembershipRequestsTab'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_JOIN_REQUESTS:
      return payload.data.joinRequests
    case ACCEPT_JOIN_REQUEST:
      return []
    default:
      return state
  }
}

export function fetchJoinRequests (communityId) {
  return {
    type: FETCH_JOIN_REQUESTS,
    graphql: {
      query: `query ($communityId: ID) {
        joinRequests (communityId: $communityId) {
          id
          user {
            id
          }
          community {
            id
          }
          status          
        }
      }`,
      variables: { communityId }
    },
    meta: {
      communityId
    }
  }
}

export function acceptJoinRequest (joinRequestId) {
  return {
    type: ACCEPT_JOIN_REQUEST,
    graphql: {
      query: `mutation ($joinRequestId: ID) {
        acceptJoinRequest(joinRequestId: $joinRequestId) {
          id
          user {
            id
          }
          community {
            id
          }
          status  
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

export function declineJoinRequest (joinRequestId) {
  return {
    type: DECLINE_JOIN_REQUEST,
    graphql: {
      query: `mutation ($joinRequestId: ID) {
        declineJoinRequest(joinRequestId: $joinRequestId) {
          id
          user {
            id
          }
          community {
            id
          }
          status  
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

// expects props to be of the form {communityId}
export const getJoinRequests = ormCreateSelector(
  orm,
  state => state.orm,
  ({ JoinRequest }) => {
    return JoinRequest
  }
)
