import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import {
  CANCEL_JOIN_REQUEST,
  FETCH_MY_JOIN_REQUESTS
} from 'store/constants'
import fetchJoinRequestsQuery from 'graphql/queries/fetchMyJoinRequestsQuery'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'

export function fetchJoinRequests () {
  return {
    type: FETCH_MY_JOIN_REQUESTS,
    graphql: {
      query: fetchJoinRequestsQuery()
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

export function cancelJoinRequest (id) {
  return {
    type: CANCEL_JOIN_REQUEST,
    graphql: {
      query: `mutation ($id: ID) {
        cancelJoinRequest(joinRequestId: $id) {
          success
        }
      }`,
      variables: { id }
    },
    meta: {
      id
    }
  }
}

// Selectors
export const getPendingJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending)
  }
)

export const getRejectedJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Rejected)
  }
)

export const getCanceledJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Canceled)
  }
)
