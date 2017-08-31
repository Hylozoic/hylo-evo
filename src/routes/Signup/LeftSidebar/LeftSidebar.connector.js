import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from './LeftSidebar.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: () => dispatch(updateUserSettings()),
    redirectHome: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
