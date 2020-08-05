import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removeCommunityFromUrl } from 'util/navigation'
import fetchCommunity from 'store/actions/fetchCommunityById'
import presentCommunity from 'store/presenters/presentCommunity'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getCommunity from 'store/selectors/getCommunity'
import { FETCH_COMMUNITY, FETCH_JOIN_REQUESTS } from 'store/constants'
import {
  createJoinRequest,
  fetchJoinRequests,
  joinCommunity
} from './CommunityDetail.store'

export function mapStateToProps (state, props) {
  const id = getRouteParam('communityId', state, props)
  const routeParams = props.match.params
  const community = presentCommunity(getCommunity(state, props), id)
  const currentUser = getMe(state)
  const { CommunityDetail } = state

  return {
    id,
    routeParams,
    community,
    currentUser,
    pending: state.pending[FETCH_COMMUNITY] || state.pending[FETCH_JOIN_REQUESTS],
    joinRequests: CommunityDetail
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { currentUser, location } = props
  const communityId = getRouteParam('communityId', {}, props)

  const closeLocation = {
    ...props.location,
    pathname: removeCommunityFromUrl(location.pathname)
  }

  return {
    fetchCommunity: () => dispatch(fetchCommunity(communityId)),
    fetchJoinRequests: () => { if (currentUser) return dispatch(fetchJoinRequests(communityId)) },
    onClose: () => dispatch(push(closeLocation)),
    joinCommunity: (communityId, userId) => dispatch(joinCommunity(communityId, userId)),
    requestToJoinCommunity: (communityId, userId) => dispatch(createJoinRequest(communityId, userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
