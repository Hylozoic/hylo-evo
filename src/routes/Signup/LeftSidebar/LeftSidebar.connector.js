import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from './LeftSidebar.store.js'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = {
  updateUserSettings
}

export default connect(mapStateToProps, mapDispatchToProps)
