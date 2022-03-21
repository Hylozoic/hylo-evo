import { get, some } from 'lodash/fp'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import { mobileRedirect } from 'util/mobile'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import updateUserSettings from 'store/actions/updateUserSettings'
import { FETCH_FOR_CURRENT_USER, FETCH_FOR_GROUP } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import isGroupRoute, { getSlugFromLocation } from 'store/selectors/isGroupRoute'
import { toggleDrawer, toggleGroupMenu } from './PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const memberships = getMyMemberships(state, props)
  const showMenuBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  const slug = getSlugFromLocation(null, props)
  const group = getGroupForCurrentRoute(state, props)
  const currentGroupMembership = group && hasMemberships && memberships.find(m => m.group.id === group.id)
  const signupState = getSignupState(state)
  const signupInProgress = signupState === SignupState.InProgress

  let routeParams = { context: 'all' }
  const match = matchPath(props.location.pathname, { path: '/:context(groups)/:groupSlug/:view(events|groups|map|members|projects|settings|stream|topics)?' }) ||
                matchPath(props.location.pathname, { path: '/:context(all|public)/:view(events|groups|map|members|projects|settings|stream|topics)?' })
  if (match) {
    routeParams = match.params
  }

  return {
    currentUser: getMe(state),
    downloadAppUrl: mobileRedirect(),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    isGroupMenuOpen: get('PrimaryLayout.isGroupMenuOpen', state),
    isGroupRoute: isGroupRoute(state, props),
    group,
    groupPending: state.pending[FETCH_FOR_GROUP],
    currentUserPending: state.pending[FETCH_FOR_CURRENT_USER],
    hasMemberships,
    currentGroupMembership,
    returnToURL: getReturnToURL(state),
    routeParams,
    showMenuBadge,
    signupInProgress,
    slug
  }
}

export const mapDispatchToProps = {
  fetchForCurrentUser,
  fetchForGroup,
  resetReturnToURL,
  toggleDrawer,
  toggleGroupMenu,
  updateUserSettings
}

export default connect(mapStateToProps, mapDispatchToProps)
