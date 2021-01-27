import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import {
  updateUserSettings, unlinkAccount,
  updateMembershipSettings,
  updateAllMemberships,
  registerStripeAccount
} from './UserSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/NonAuthLayout/Login/Login.store'
import { createSelector } from 'reselect'
import unBlockUser from 'store/actions/unBlockUser'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import getCurrentUserMemberships from 'store/selectors/getCurrentUserMemberships'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import { get, every, includes } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

export const getAllCommunitiesSettings = createSelector(
  getCurrentUserMemberships,
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
  const allCommunitiesSettings = getAllCommunitiesSettings(state, props)
  const memberships = getCurrentUserMemberships(state, props)
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
    allCommunitiesSettings,
    memberships,
    messageSettings,
    queryParams
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    updateUserSettings: (params) => dispatch(updateUserSettings(params)),
    unBlockUser: (params) => dispatch(unBlockUser(params)),
    loginWithService: (params) => dispatch(loginWithService(params)),
    unlinkAccount: (params) => dispatch(unlinkAccount(params)),
    setConfirmBeforeClose: (params) => dispatch(setConfirmBeforeClose(params)),
    updateMembershipSettings: (communityId, settings) => dispatch(updateMembershipSettings(communityId, settings)),
    updateAllMemberships: (communityIds, settings) => dispatch(updateAllMemberships(communityIds, settings)),
    registerStripeAccount: (params) => dispatch(registerStripeAccount(params))
  }
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
