import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import { UPLOAD_IMAGE } from 'store/constants'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_IMAGE]
  return {
    currentUser: getMe(state),
    uploadImagePending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: () => dispatch(updateUserSettings()),
    goToNextStep: () => dispatch(push('/')),
    goToPreviousStep: () => dispatch(push('/signup/add-skills')),
    goBack: () => dispatch(goBack())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
