import { connect } from 'react-redux'
import { useInvitation } from 'routes/JoinGroup/JoinGroup.store'
import { FETCH_MY_REQUESTS_AND_INVITES } from 'store/constants'
import {
  cancelJoinRequest,
  declineInvite,
  fetchMyInvitesAndRequests,
  getCanceledJoinRequests,
  getPendingGroupInvites,
  getPendingJoinRequests,
  getRejectedJoinRequests
} from './ManageInvitesTab.store'

export function mapStateToProps (state, props) {
  const canceledJoinRequests = getCanceledJoinRequests(state, props)
  const pendingGroupInvites = getPendingGroupInvites(state, props)
  const pendingJoinRequests = getPendingJoinRequests(state, props)
  const rejectedJoinRequests = getRejectedJoinRequests(state, props)

  return {
    canceledJoinRequests,
    pending: state.pending[FETCH_MY_REQUESTS_AND_INVITES],
    pendingGroupInvites,
    pendingJoinRequests,
    rejectedJoinRequests
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    acceptInvite: (invitationToken) => dispatch(useInvitation({ invitationToken })),
    cancelJoinRequest: (params) => dispatch(cancelJoinRequest(params)),
    declineInvite: (inviteId) => dispatch(declineInvite(inviteId)),
    fetchMyInvitesAndRequests: () => dispatch(fetchMyInvitesAndRequests())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
