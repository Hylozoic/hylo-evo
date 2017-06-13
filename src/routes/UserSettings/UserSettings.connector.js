import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { fetchUserSettings, updateUserSettings, leaveCommunity, unlinkAccount } from './UserSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/Login/Login.store'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

// this selector assumes that all Memberships belong to the currentUser
// using this instead of currentUser.memberships to avoid a memoization issue
// see https://github.com/tommikaikkonen/redux-orm/issues/117
export const getCurrentUserMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  (session) =>
    session.Membership.all().toModelArray()
)

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const memberships = getCurrentUserMemberships(state, props)

  const confirm = state.FullPageModal.confirm

  return {
    currentUser,
    memberships,
    confirm
  }
}

export const mapDispatchToProps = {
  fetchUserSettings,
  updateUserSettings,
  leaveCommunity,
  loginWithService,
  unlinkAccount,
  setConfirmBeforeClose,
  updateMembershipSetting: (communityId, setting) => console.log('updateMembershipSetting', communityId, setting)
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
