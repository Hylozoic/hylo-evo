import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchUserSettings, updateUserSettings } from './Settings.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {
  goBack,
  fetchUserSettings,
  updateUserSettings
}

export default connect(mapStateToProps, mapDispatchToProps)
