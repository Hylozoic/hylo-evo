import { connect } from 'react-redux'
import { toggleDrawer } from './PrimaryLayout.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForCommunity from 'store/actions/fetchForCommunity'
import registerUserWithHoloChat from 'store/actions/registerUserWithHoloChat'
import { FETCH_FOR_COMMUNITY } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getMemberships from 'store/selectors/getMemberships'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { get, some } from 'lodash/fp'
import mobileRedirect from 'util/mobileRedirect'

// TODO: this is the master switch, to be replaced with the subdomain switch
const holoMode = false

export function mapStateToProps (state, props) {
  const memberships = getMemberships(state, props)
  const showLogoBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
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
    holoMode
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)
  // const { holoMode } = props

  return {
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics)),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug)),
    toggleDrawer: () => dispatch(toggleDrawer()),
    registerUserWithHoloChat: holoMode
      ? user => dispatch(registerUserWithHoloChat(user))
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
