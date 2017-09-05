import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { UPLOAD_IMAGE } from 'store/constants'
import { fetchMySkills, updateUserSettings } from './Review.store'

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
    goToNextStep: () => dispatch(push('/')),
    goToPreviousStep: () => dispatch(push('/signup/add-skills')),
    goBack: () => dispatch(goBack()),
    fetchMySkills: () => dispatch(fetchMySkills())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
