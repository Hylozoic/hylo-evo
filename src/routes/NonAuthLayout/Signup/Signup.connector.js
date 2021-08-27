import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getLoginError from 'store/selectors/getLoginError'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import mobileRedirect from 'util/mobileRedirect'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { signup } from './Signup.store'
import { loginWithService } from '../Login/Login.store'

export function mapStateToProps (state, props) {
  return {
    error: getLoginError(state),
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state),
    downloadAppUrl: mobileRedirect()
  }
}

export const mapDispatchToProps = {
  signup,
  resetReturnToURL,
  loginWithService,
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
