import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import {
  fetchSavedSearches, deleteSearch, viewSavedSearch,
  updateUserSettings, unlinkAccount,
  updateMembershipSettings, updateAllMemberships, registerStripeAccount
} from './UserSettings.store'
import { generateViewParams } from 'util/savedSearch'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/NonAuthLayout/Login/Login.store'
import { createSelector } from 'reselect'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import unBlockUser from 'store/actions/unBlockUser'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import getCurrentUserMemberships from 'store/selectors/getCurrentUserMemberships'
import { FETCH_FOR_CURRENT_USER, FETCH_SAVED_SEARCHES } from 'store/constants'
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
  const messageSettings = getMessageSettings(state, props)
  const searches = state.SavedSearches.searches

  const confirm = get('FullPageModal.confirm', state)
  const fetchPending = state.pending[FETCH_FOR_CURRENT_USER] || state.pending[FETCH_SAVED_SEARCHES]
  const queryParams = {
    registered: getQuerystringParam('registered', null, props)
  }

  return {
    currentUser,
    blockedUsers,
    confirm,
    fetchPending,
    allCommunitiesSettings,
    messageSettings,
    searches,
    queryParams
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchForCurrentUser: (params) => dispatch(fetchForCurrentUser(params)),
    fetchSavedSearches: (params) => dispatch(fetchSavedSearches(params)),
    deleteSearch: (params) => dispatch(deleteSearch(params)),
    updateUserSettings: (params) => dispatch(updateUserSettings(params)),
    unBlockUser: (params) => dispatch(unBlockUser(params)),
    loginWithService: (params) => dispatch(loginWithService(params)),
    unlinkAccount: (params) => dispatch(unlinkAccount(params)),
    setConfirmBeforeClose: (params) => dispatch(setConfirmBeforeClose(params)),
    updateMembershipSettings: (params) => dispatch(updateMembershipSettings(params)),
    updateAllMemberships: (params) => dispatch(updateAllMemberships(params)),
    registerStripeAccount: (params) => dispatch(registerStripeAccount(params)),
    viewSavedSearch: (search) => {
      const { mapPath } = generateViewParams(search)
      dispatch(viewSavedSearch(search))
      dispatch(push(mapPath))
    }
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
