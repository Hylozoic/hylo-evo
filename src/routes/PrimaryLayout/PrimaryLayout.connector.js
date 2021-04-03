import { connect } from 'react-redux'
import { toggleDrawer } from './PrimaryLayout.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import updateUserSettings from 'store/actions/updateUserSettings'
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
  const group = getGroupForCurrentRoute(state, props)
  const memberOfCurrentGroup = group && hasMemberships && memberships.find(m => m.group.id === group.id)

  return {
    currentUser: getMe(state),
    downloadAppUrl: mobileRedirect(),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    isGroupRoute: isGroupRoute(state, props),
    group,
    groupPending: state.pending[FETCH_FOR_GROUP],
    hasMemberships,
    memberOfCurrentGroup,
    returnToURL: getReturnToURL(state),
    showLogoBadge,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: () => dispatch(fetchForCurrentUser(slug)),
    fetchForGroup: () => dispatch(fetchForGroup(slug)),
    toggleDrawer: () => dispatch(toggleDrawer()),
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
