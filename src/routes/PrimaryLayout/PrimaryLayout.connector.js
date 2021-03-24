import { connect } from 'react-redux'
import { toggleDrawer } from './PrimaryLayout.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import { FETCH_FOR_GROUP } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyMemberships from 'store/selectors/getMyMemberships'
import isGroupRoute, { getSlugFromLocation } from 'store/selectors/isGroupRoute'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { get, some } from 'lodash/fp'
import mobileRedirect from 'util/mobileRedirect'

export function mapStateToProps (state, props) {
  const memberships = getMyMemberships(state, props)
  const showLogoBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  const slug = getSlugFromLocation(null, props)

  return {
    isGroupRoute: isGroupRoute(state, props),
    group: getGroupForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    showLogoBadge,
    hasMemberships,
    groupPending: state.pending[FETCH_FOR_GROUP],
    returnToURL: getReturnToURL(state),
    downloadAppUrl: mobileRedirect(),
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: () => dispatch(fetchForCurrentUser(slug)),
    fetchForGroup: () => dispatch(fetchForGroup(slug)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
