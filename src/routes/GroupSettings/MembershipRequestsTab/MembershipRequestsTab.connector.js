import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { groupUrl } from 'util/navigation'
import {
  acceptJoinRequest,
  declineJoinRequest,
  fetchJoinRequests
} from './MembershipRequestsTab.store'

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
    acceptJoinRequest: (joinRequestId) => dispatch(acceptJoinRequest(joinRequestId)),
    declineJoinRequest: (joinRequestId) => dispatch(declineJoinRequest(joinRequestId)),
    fetchJoinRequests: (groupId) => dispatch(fetchJoinRequests(groupId)),
    viewMembers: (slug) => dispatch(push(groupUrl(slug, 'members')))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
