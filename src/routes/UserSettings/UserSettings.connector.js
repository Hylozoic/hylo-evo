import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import {
  updateUserSettings, unlinkAccount,
  updateMembershipSettings,
  updateAllMemberships,
  registerStripeAccount
} from './UserSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import logout from 'store/actions/logout'
import { createSelector } from 'reselect'
import unBlockUser from 'store/actions/unBlockUser'
import deactivateMe from 'store/actions/deactivateMe'
import deleteMe from 'store/actions/deleteMe'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import { get, every, includes } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { fetchLocation } from 'components/LocationInput/LocationInput.store'

export const getAllGroupsSettings = createSelector(
  getMyMemberships,
  memberships => ({
    sendEmail: every(m => m.settings && m.settings.sendEmail, memberships),
    sendPushNotifications: every(m => m.settings && m.settings.sendPushNotifications, memberships)
  })
)

export const getMessageSettings = createSelector(
  getMe,
  me => me && ({
    sendEmail: includes(me.settings && me.settings.dmNotifications, ['email', 'both']),
    sendPushNotifications: includes(me.settings && me.settings.dmNotifications, ['push', 'both'])
  })
)

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const blockedUsers = getBlockedUsers(state, props)
  const allGroupsSettings = getAllGroupsSettings(state, props)
  const memberships = getMyMemberships(state, props).sort((a, b) => a.group.name.localeCompare(b.group.name))
  const messageSettings = getMessageSettings(state, props)
  const confirm = get('FullPageModal.confirm', state)
  const fetchPending = state.pending[FETCH_FOR_CURRENT_USER]
  const queryParams = {
    registered: getQuerystringParam('registered', null, props)
  }

  return {
    currentUser,
    blockedUsers,
    confirm,
    fetchPending,
    allGroupsSettings,
    memberships,
    messageSettings,
    queryParams
  }
}

export const mapDispatchToProps = {
  deactivateMe,
  deleteMe,
  updateUserSettings,
  unBlockUser,
  logout,
  unlinkAccount,
  setConfirmBeforeClose,
  updateMembershipSettings,
  updateAllMemberships,
  registerStripeAccount,
  fetchLocation
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { confirm } = stateProps
  const { setConfirmBeforeClose } = dispatchProps
  const setConfirm = newState => {
    if (newState === confirm) return
    return setConfirmBeforeClose(newState)
  }
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setConfirm
  }
}

export default component => connect(mapStateToProps, mapDispatchToProps, mergeProps)(component)
