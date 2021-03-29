import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    goToPreviousStep: () => dispatch(push('/signup/upload-photo')),
    goBack: () => dispatch(goBack()),
    push: (path) => dispatch(push(path)),
    resetReturnToURL: () => dispatch(resetReturnToURL())

  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  console.log(stateProps.returnToURL)
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: (defaultPath = '/signup/review') => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
