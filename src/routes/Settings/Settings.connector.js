import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchUserSettings, updateUserSettings, leaveCommunity } from './Settings.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communities = currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community)

  return {
    currentUser,
    communities
  }
}

export const mapDispatchToProps = {
  goBack,
  fetchUserSettings,
  updateUserSettings,
  leaveCommunity
}

export default connect(mapStateToProps, mapDispatchToProps)
