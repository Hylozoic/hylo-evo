import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import getMyMemberships from 'store/selectors/getMyMemberships'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const queryProps = { groupSlug: group.slug }
  const memberships = getMyMemberships(state, props)
  const joinRequests = getMyJoinRequests(state, props).filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending)
  const childGroups = getChildGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
    return g
  })
  const parentGroups = getParentGroups(state, queryProps).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
    return g
  })

  return {
    childGroups,
    group,
    memberships,
    parentGroups,
    routeParams: get('match.params', props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
