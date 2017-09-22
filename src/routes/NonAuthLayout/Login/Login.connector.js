import { connect } from 'react-redux'
import getLoginError from 'store/selectors/getLoginError'
import { checkLogin, login, loginWithService } from './Login.store'
import { push } from 'react-router-redux'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    error: getLoginError(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  checkLogin,
  login,
  loginWithService,
  resetReturnToURL,
  push
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
