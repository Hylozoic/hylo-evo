import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from 'store/actions/updateUserSettings'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
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
