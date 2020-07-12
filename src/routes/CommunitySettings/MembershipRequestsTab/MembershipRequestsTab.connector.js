import { connect } from 'react-redux'
import {
  acceptJoinRequest,
  declineJoinRequest,
  fetchJoinRequests,
  getJoinRequests
} from './MembershipRequestsTab.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const joinRequests = getJoinRequests(state, props)
  const { community } = props

  return {
    communityId: get('id', community),
    joinRequests
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    acceptJoinRequest: joinRequestId => dispatch(acceptJoinRequest(joinRequestId)),
    declineJoinRequest: joinRequestId => dispatch(declineJoinRequest(joinRequestId)),
    fetchJoinRequestsMaker: communityId => () => dispatch(fetchJoinRequests(communityId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { communityId } = stateProps
  const { fetchJoinRequestsMaker } = dispatchProps
  let fetchJoinRequests

  if (communityId) {
    fetchJoinRequests = fetchJoinRequestsMaker(communityId)
  } else {
    fetchJoinRequests = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchJoinRequests
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
