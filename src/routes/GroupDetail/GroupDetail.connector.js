import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removeGroupFromUrl } from 'util/navigation'
import fetchGroup from 'store/actions/fetchGroupById'
import presentGroup from 'store/presenters/presentGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getGroup from 'store/selectors/getGroup'
import { FETCH_GROUP, FETCH_JOIN_REQUESTS } from 'store/constants'
import {
  createJoinRequest,
  fetchJoinRequests,
  joinGroup
} from './GroupDetail.store'

export function mapStateToProps (state, props) {
  const id = props.groupId || getRouteParam('groupId', state, props)
  const routeParams = props.match.params
  const group = presentGroup(getGroup(state, props), id)
  const currentUser = getMe(state)
  const { GroupDetail } = state

  return {
    id,
    routeParams,
    group,
    currentUser,
    pending: state.pending[FETCH_GROUP] || state.pending[FETCH_JOIN_REQUESTS],
    joinRequests: GroupDetail
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { currentUser, location } = props
  const groupId = getRouteParam('groupId', {}, props)

  const closeLocation = {
    ...props.location,
    pathname: removeGroupFromUrl(location.pathname)
  }

  return {
    fetchGroup: () => dispatch(fetchGroup(groupId)),
    fetchJoinRequests: () => { if (currentUser) return dispatch(fetchJoinRequests(groupId)) },
    onClose: () => dispatch(push(closeLocation)),
    joinGroup: (groupId, userId) => dispatch(joinGroup(groupId, userId)),
    requestToJoinGroup: (groupId, userId) => dispatch(createJoinRequest(groupId, userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
