import { get, some } from 'lodash/fp'
import { connect } from 'react-redux'
import getReturnToPath from 'store/selectors/getReturnToPath'
import setReturnToPath from 'store/actions/setReturnToPath'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import fetchForGroup from 'store/actions/fetchForGroup'
import updateUserSettings from 'store/actions/updateUserSettings'
import { FETCH_FOR_CURRENT_USER, FETCH_FOR_GROUP } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { getSignupInProgress } from 'store/selectors/getSignupState'
import isGroupRoute, { getSlugFromLocation } from 'store/selectors/isGroupRoute'
import { toggleDrawer, toggleGroupMenu } from './AuthLayoutRouter.store'
import getLastViewedGroup from 'store/selectors/getLastViewedGroup'

export function mapStateToProps (state, props) {
  const memberships = getMyMemberships(state, props)
  const showMenuBadge = some(m => m.newPostCount > 0, memberships)
  const hasMemberships = memberships.length > 0
  const slug = getSlugFromLocation(null, props)
  const group = getGroupForCurrentRoute(state, props)
  const lastViewedGroup = getLastViewedGroup(state)
  const currentGroupMembership = group && hasMemberships && memberships.find(m => m.group.id === group.id)
  const signupInProgress = getSignupInProgress(state)
  // NOTE: PENDING as we've generally used it can be misleading and may need reconsideration:
  // Currently the `Pending` state for an action will be `undefined` therefore falsy
  // before a the action has been called. In this case this was causing the component
  // to render through without a `currentUser` on initial render which was causing issues.
  // By default the pendingMiddleware keeps the key once it's been used, so it's value
  // becomes `null`. In most cases I think we want the pending / loading state to be true
  // before and during the initial fetch or action is ran.
  //
  // Recommentaion: Either update `pendingMiddleware` logic, create a selector which
  // acknowledges this case, handle the loading state within the component.
  const currentUserPending = state.pending[FETCH_FOR_CURRENT_USER] ||
    state.pending[FETCH_FOR_CURRENT_USER] === undefined
  const routeParams = { context: 'all', ...props.match.params }

  return {
    currentUser: getMe(state),
    currentUserPending,
    currentGroupMembership,
    group,
    groupPending: state.pending[FETCH_FOR_GROUP],
    hasMemberships,
    isDrawerOpen: get('AuthLayoutRouter.isDrawerOpen', state),
    isGroupMenuOpen: get('AuthLayoutRouter.isGroupMenuOpen', state),
    isGroupRoute: isGroupRoute(state, props),
    lastViewedGroup,
    returnToPath: getReturnToPath(state),
    routeParams,
    showMenuBadge,
    signupInProgress,
    slug
  }
}

export const mapDispatchToProps = {
  fetchForCurrentUser,
  fetchForGroup,
  setReturnToPath,
  toggleDrawer,
  toggleGroupMenu,
  updateUserSettings
}

export default connect(mapStateToProps, mapDispatchToProps)
