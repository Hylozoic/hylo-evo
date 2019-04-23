import { connect } from 'react-redux'
import { toggleDrawer } from './PrimaryLayout.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForCommunity from 'store/actions/fetchForCommunity'
import holochainFetchForCommunity from 'store/actions/holochainFetchForCommunity'
import { FETCH_FOR_COMMUNITY } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getMemberships from 'store/selectors/getMemberships'
import getHolochainActive from 'store/selectors/getHolochainActive'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { get, some } from 'lodash/fp'
import mobileRedirect from 'util/mobileRedirect'

export function mapStateToProps (state, props) {
  const memberships = getMemberships(state, props)
  const showLogoBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  const slug = getSlugFromLocation(null, props)

  return {
    isCommunityRoute: isCommunityRoute(state, props),
    community: getCommunityForCurrentRoute(state, props),
    network: getNetworkForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    showLogoBadge,
    hasMemberships,
    communityPending: state.pending[FETCH_FOR_COMMUNITY],
    returnToURL: getReturnToURL(state),
    downloadAppUrl: mobileRedirect(),
    holochainActive: getHolochainActive(state),
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics)),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug)),
    holochainFetchForCommunity: () => dispatch(holochainFetchForCommunity(slug)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { holochainActive } = stateProps
  const fetchForCommunity = holochainActive
    ? dispatchProps.holochainFetchForCommunity
    : dispatchProps.fetchForCommunity

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchForCommunity
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
