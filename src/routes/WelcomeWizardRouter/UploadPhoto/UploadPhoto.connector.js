import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { push, goBack } from 'connected-react-router'
import updateUserSettings from 'store/actions/updateUserSettings'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_ATTACHMENT]
  return {
    currentUser: getMe(state),
    uploadImagePending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToNextStep: () => dispatch(push('/welcome/add-location')),
    goBack: () => dispatch(goBack())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
