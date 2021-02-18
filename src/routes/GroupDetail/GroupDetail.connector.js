import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removeGroupFromUrl } from 'util/navigation'
import fetchGroupBySlug from 'store/actions/fetchGroupBySlug'
import presentGroup from 'store/presenters/presentGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getGroupForDetails from 'store/selectors/getGroupForDetails'
import { FETCH_GROUP, FETCH_JOIN_REQUESTS } from 'store/constants'
import {
  createJoinRequest,
  fetchJoinRequests,
  joinGroup
} from './GroupDetail.store'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('detailGroupSlug', state, props)
  const routeParams = props.match.params
  const group = presentGroup(getGroupForDetails(state, props))
  const currentUser = getMe(state)
  const { GroupDetail } = state

  return {
    slug,
    routeParams,
    group,
    currentUser,
    pending: state.pending[FETCH_GROUP] || state.pending[FETCH_JOIN_REQUESTS],
    joinRequests: GroupDetail
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props

  const slug = getRouteParam('detailGroupSlug', {}, props)

  const closeLocation = {
    ...props.location,
    pathname: removeGroupFromUrl(location.pathname)
  }

  return {
    fetchGroup: () => dispatch(fetchGroupBySlug(slug)),
    fetchJoinRequests: (groupId) => () => dispatch(fetchJoinRequests(groupId)),
    onClose: () => dispatch(push(closeLocation)),
    joinGroup: (groupId, userId) => () => dispatch(joinGroup(groupId, userId)),
    requestToJoinGroup: (groupId, userId) => () => dispatch(createJoinRequest(groupId, userId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, group } = stateProps
  const { fetchJoinRequests, joinGroup, requestToJoinGroup } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchJoinRequests: currentUser && group ? fetchJoinRequests(group.id) : () => {},
    joinGroup: currentUser && group ? joinGroup(group.id, currentUser.id) : () => {},
    requestToJoinGroup: currentUser && group ? requestToJoinGroup(group.id, currentUser.id) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
