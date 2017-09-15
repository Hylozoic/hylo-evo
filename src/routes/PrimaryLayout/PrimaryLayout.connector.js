import { connect } from 'react-redux'
import {
  fetchForCurrentUser, fetchForCommunity, toggleDrawer
} from './PrimaryLayout.store'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getMemberships from 'store/selectors/getMemberships'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import { some } from 'lodash/fp'

function mapStateToProps (state, props) {
  const memberships = getMemberships(state, props)
  const showLogoBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  return {
    isCommunityRoute: isCommunityRoute(state, props),
    community: getCommunityForCurrentRoute(state, props),
    network: getNetworkForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.PrimaryLayout.isDrawerOpen,
    showLogoBadge,
    hasMemberships
  }
}

function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics)),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
