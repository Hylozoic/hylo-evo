import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removeCommunityFromUrl } from 'util/navigation' // editPostUrl,
import fetchCommunity from 'store/actions/fetchCommunityById'
import presentCommunity from 'store/presenters/presentCommunity'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getCommunity from 'store/selectors/getCommunity'
import { FETCH_COMMUNITY } from 'store/constants'

export function mapStateToProps (state, props) {
  const id = getRouteParam('communityId', state, props)
  const routeParams = props.match.params
  const community = presentCommunity(getCommunity(state, props), id)
  const currentUser = getMe(state)

  return {
    id,
    routeParams,
    community,
    currentUser,
    pending: state.pending[FETCH_COMMUNITY]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props
  const communityId = getRouteParam('communityId', {}, props)
  const closeLocation = {
    ...props.location,
    pathname: removeCommunityFromUrl(location.pathname)
  }

  return {
    fetchCommunity: () => dispatch(fetchCommunity(communityId)),
    onClose: () => dispatch(push(closeLocation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
