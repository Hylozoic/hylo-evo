import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToNextStep: () => dispatch(push('/signup/review')), // FIXME /add-skills
    goToPreviousStep: () => dispatch(push('/signup/upload-photo')),
    goBack: () => dispatch(goBack())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
