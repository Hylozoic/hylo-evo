import { connect } from 'react-redux'
import getLoginError from 'store/selectors/getLoginError'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { signup } from './Signup.store'

export function mapStateToProps (state) {
  return {
    error: getLoginError(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  signup,
  resetReturnToURL
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    redirectOnSignIn: (defaultPath) => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
