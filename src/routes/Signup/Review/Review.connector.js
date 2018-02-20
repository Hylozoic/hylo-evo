import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { UPLOAD_ATTACHMENT } from 'store/constants'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import fetchMySkills from 'store/actions/fetchMySkills'
import getMySkills from 'store/selectors/getMySkills'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  const uploadImagePending = state.pending[UPLOAD_ATTACHMENT]
  return {
    currentUser: getMe(state),
    uploadImagePending,
    skills: getMySkills(state),
    returnToURL: getReturnToURL(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToPreviousStep: () => dispatch(push('/signup/add-skills')),
    goBack: () => dispatch(goBack()),
    push: (path) => dispatch(push(path)),
    fetchMySkills: () => dispatch(fetchMySkills()),
    resetReturnToURL: () => dispatch(resetReturnToURL())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: (defaultPath = '/all') => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
