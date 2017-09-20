import { some } from 'lodash/fp'
import { connect } from 'react-redux'
import fetchForCommunity from 'store/actions/fetchForCommunity'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getMemberships from 'store/selectors/getMemberships'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import { toggleDrawer } from './AuthLayout.store'
import { FETCH_FOR_COMMUNITY } from 'store/constants'

function mapStateToProps (state, props) {
  const memberships = getMemberships(state, props)
  const showLogoBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  return {
    isCommunityRoute: isCommunityRoute(state, props),
    community: getCommunityForCurrentRoute(state, props),
    network: getNetworkForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.AuthLayout.isDrawerOpen,
    showLogoBadge,
    hasMemberships,
    communityPending: state.pending[FETCH_FOR_COMMUNITY]
  }
}

function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
