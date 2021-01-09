import { connect } from 'react-redux'
import {
  acceptJoinRequest,
  declineJoinRequest,
  fetchJoinRequests
} from './MembershipRequestsTab.store'
import { get } from 'lodash/fp'
import { push } from 'connected-react-router'

export function mapStateToProps (state, props) {
  const { group } = props
  const { MembershipRequests } = state

  return {
    groupId: get('id', group),
    joinRequests: MembershipRequests
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    acceptJoinRequest: (joinRequestId, groupId, userId, moderatorId) => dispatch(acceptJoinRequest(joinRequestId, groupId, userId, moderatorId)),
    declineJoinRequest: (joinRequestId) => dispatch(declineJoinRequest(joinRequestId)),
    fetchJoinRequests: (groupId) => dispatch(fetchJoinRequests(groupId)),
    viewMembers: (slug) => dispatch(push(`/g/${slug}/members`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
