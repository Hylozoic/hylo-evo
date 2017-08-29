import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { push } from 'react-router-redux'
import { updateUserSettings } from './UploadPhoto.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: () => dispatch(updateUserSettings()),
    goToNextStep: () => dispatch(push('/signup/create-community'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
