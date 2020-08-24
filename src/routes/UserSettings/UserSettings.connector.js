import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import {
  fetchSavedSearches, deleteSearch,
  updateUserSettings, leaveCommunity, unlinkAccount,
  updateMembershipSettings, updateAllMemberships, registerStripeAccount
} from './UserSettings.store'
import { 
  fetchMembers, fetchPosts, fetchPublicCommunities, storeFetchPostsParam, storeClientFilterParams
} from '../MapExplorer/MapExplorer.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/NonAuthLayout/Login/Login.store'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import orm from 'store/models'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import unBlockUser from 'store/actions/unBlockUser'
import getBlockedUsers from 'store/selectors/getBlockedUsers'
import { FETCH_FOR_CURRENT_USER, FETCH_SAVED_SEARCHES } from 'store/constants'
import { get, every, includes } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

// this selector assumes that all Memberships belong to the currentUser
// using this instead of currentUser.memberships to avoid a memoization issue
// see https://github.com/tommikaikkonen/redux-orm/issues/117
export const getCurrentUserMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  (session) =>
    session.Membership.all().toModelArray()
)

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
  const memberships = getCurrentUserMemberships(state, props)
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
    memberships,
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
    leaveCommunity: (params) => dispatch(leaveCommunity(params)),
    loginWithService: (params) => dispatch(loginWithService(params)),
    unlinkAccount: (params) => dispatch(unlinkAccount(params)),
    setConfirmBeforeClose: (params) => dispatch(setConfirmBeforeClose(params)),
    updateMembershipSettings: (params) => dispatch(updateMembershipSettings(params)),
    updateAllMemberships: (params) => dispatch(updateAllMemberships(params)),
    registerStripeAccount: (params) => dispatch(registerStripeAccount(params)),
    viewSavedSearch: (params, path) => {
      const { boundingBox, featureTypes, search, topics } = params
      dispatch(push(path))
      dispatch(fetchMembers({ ...params }))
      dispatch(fetchPosts({ ...params }))
      dispatch(fetchPublicCommunities({ ...params}))
      dispatch(storeFetchPostsParam({ boundingBox }))
      dispatch(storeClientFilterParams({ featureTypes, search, topics }))
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
