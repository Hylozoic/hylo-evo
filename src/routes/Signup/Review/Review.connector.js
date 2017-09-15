import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { UPLOAD_ATTACHMENT } from 'store/constants'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import fetchMySkills from 'store/actions/fetchMySkills'
import getMySkills from 'store/selectors/getMySkills'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_ATTACHMENT]
  return {
    currentUser: getMe(state),
    uploadImagePending,
    skills: getMySkills(state)
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
