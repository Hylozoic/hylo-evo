import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { fetchUserSettings, updateUserSettings, leaveCommunity, unlinkAccount } from './UserSettings.store'
import { setFullPageModalModified } from '../FullPageModal/FullPageModal.store'
import { loginWithService } from 'routes/Login/Login.store'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

// this selector assumes that all Memberships belong to the currentUser
// using this instead of currentUser.memberships to avoid a memoization issue
// see https://github.com/tommikaikkonen/redux-orm/issues/117
export const getCurrentUserCommunities = ormCreateSelector(
  orm,
  state => state.orm,
  (session) =>
    session.Membership.all().toModelArray().map(m => m.community)
)

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communities = getCurrentUserCommunities(state, props)
  const modified = state.FullPageModalModified

  return {
    currentUser,
    communities,
    modified
  }
}

export const mapDispatchToProps = {
  fetchUserSettings,
  updateUserSettings,
  leaveCommunity,
  loginWithService,
  unlinkAccount,
  setFullPageModalModified
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { modified } = stateProps
  const { setFullPageModalModified } = dispatchProps
  const setModified = newState => {
    if (newState === modified) return
    return setFullPageModalModified(newState)
  }
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setModified
  }
}

export default component => connect(mapStateToProps, mapDispatchToProps, mergeProps)(component)
