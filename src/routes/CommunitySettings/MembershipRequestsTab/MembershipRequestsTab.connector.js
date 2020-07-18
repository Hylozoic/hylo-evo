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
    acceptJoinRequest: (joinRequestId, communityId, userId, moderatorId) => dispatch(acceptJoinRequest(joinRequestId, communityId, userId, moderatorId)),
    declineJoinRequest: (joinRequestId) => dispatch(declineJoinRequest(joinRequestId)),
    fetchJoinRequests: (communityId) => dispatch(fetchJoinRequests(communityId)),
    viewMembers: (slug) => dispatch(push(`/c/${slug}/members`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
