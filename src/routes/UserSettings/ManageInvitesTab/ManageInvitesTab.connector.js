import { connect } from 'react-redux'
import { FETCH_MY_JOIN_REQUESTS } from 'store/constants'
import presentJoinRequest from 'store/presenters/presentJoinRequest'
import {
  getCanceledJoinRequests,
  getPendingJoinRequests,
  getRejectedJoinRequests,
  fetchJoinRequests,
  cancelJoinRequest
} from './ManageInvitesTab.store'

export function mapStateToProps (state, props) {
  const pendingJoinRequests = getPendingJoinRequests(state, props).map(jr => presentJoinRequest(jr))
  const rejectedJoinRequests = getRejectedJoinRequests(state, props).map(jr => presentJoinRequest(jr))
  const canceledJoinRequests = getCanceledJoinRequests(state, props).map(jr => presentJoinRequest(jr))

  return {
    canceledJoinRequests,
    pending: state.pending[FETCH_MY_JOIN_REQUESTS],
    pendingJoinRequests,
    rejectedJoinRequests
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchJoinRequests: () => dispatch(fetchJoinRequests()),
    cancelJoinRequest: (params) => dispatch(cancelJoinRequest(params))
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
