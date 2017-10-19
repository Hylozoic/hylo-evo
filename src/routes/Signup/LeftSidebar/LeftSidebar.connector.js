import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  updateUserSettings,
  resetReturnToURL,
  push
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    handleCloseSignupModal: (defaultPath = '/') => {
      const changes = {settings: {signupInProgress: false}}
      return dispatchProps.updateUserSettings(changes).then(() => {
        dispatchProps.resetReturnToURL()
        dispatchProps.push(stateProps.returnToURL || defaultPath)
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
