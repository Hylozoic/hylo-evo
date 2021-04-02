import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import {
  CANCEL_JOIN_REQUEST,
  DECLINE_GROUP_INVITE,
  FETCH_MY_REQUESTS_AND_INVITES
} from 'store/constants'
import presentGroupInvite from 'store/presenters/presentGroupInvite'
import presentJoinRequest from 'store/presenters/presentJoinRequest'
import fetchMyInvitesAndRequestsQuery from 'graphql/queries/fetchMyInvitesAndRequestsQuery'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'

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

export function declineInvite (id) {
  return {
    type: DECLINE_GROUP_INVITE,
    graphql: {
      query: `mutation ($id: ID) {
        expireInvitation(invitationId: $id) {
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

export function fetchMyInvitesAndRequests () {
  return {
    type: FETCH_MY_REQUESTS_AND_INVITES,
    graphql: {
      query: fetchMyInvitesAndRequestsQuery
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

// Selectors
export const getPendingGroupInvites = ormCreateSelector(
  orm,
  (session) => {
    const me = session.Me.first()
    if (!me) return []
    return me.groupInvitesPending.toModelArray().map(i => presentGroupInvite(i))
  }
)

export const getPendingJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending).map(jr => presentJoinRequest(jr))
  }
)

export const getRejectedJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Rejected).map(jr => presentJoinRequest(jr))
  }
)

export const getCanceledJoinRequests = ormCreateSelector(
  orm,
  getMyJoinRequests,
  (session, myJoinRequests) => {
    return myJoinRequests.filter(jr => jr.status === JOIN_REQUEST_STATUS.Canceled).map(jr => presentJoinRequest(jr))
  }
)
