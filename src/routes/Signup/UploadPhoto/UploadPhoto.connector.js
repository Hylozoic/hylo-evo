import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { push } from 'react-router-redux'
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
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToNextStep: () => dispatch(push('/signup/add-location'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
