import { connect } from 'react-redux'
import {
  acceptJoinRequest,
  declineJoinRequest,
  fetchJoinRequests
} from './MembershipRequestsTab.store'
import { get } from 'lodash/fp'
import { push } from 'connected-react-router'

export function mapStateToProps (state, props) {
  const { community, joinRequests } = props
  const { JoinRequests } = state

  return {
    communityId: get('id', community),
    joinRequests: JoinRequests
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    acceptJoinRequest: (joinRequestId, communityId, userId) => dispatch(acceptJoinRequest(joinRequestId, communityId, userId)),
    declineJoinRequest: (joinRequestId) => dispatch(declineJoinRequest(joinRequestId)),
    fetchJoinRequestsMaker: communityId => () => dispatch(fetchJoinRequests(communityId)),
    viewMembers: (slug) => dispatch(push(`/c/${slug}/members`))
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
