import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchUserSettings, updateUserSettings, leaveCommunity } from './Settings.store'
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

  const previousLocation = state.history.slice(-2)[0].pathname
  let backLocation = '/'
  if (state.history.length > 1 && previousLocation !== '/login') {
    backLocation = previousLocation
  }

  return {
    currentUser,
    communities,
    backLocation
  }
}

export const mapDispatchToProps = {
  push,
  fetchUserSettings,
  updateUserSettings,
  leaveCommunity
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { backLocation } = stateProps
  const { push } = dispatchProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onClose: () => push(backLocation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
