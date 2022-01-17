import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getLoginError from 'store/selectors/getLoginError'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import mobileRedirect from 'util/mobileRedirect'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { sendEmailVerification, signup } from './Signup.store'
import { loginWithService } from '../Login/Login.store'

export function mapStateToProps (state, props) {
  return {
    downloadAppUrl: mobileRedirect(),
    error: getLoginError(state) || getQuerystringParam('error', state, props),
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  sendEmailVerification,
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
    },
    sendEmailVerification: (email) => {
      dispatchProps.sendEmailVerification(email).then(
        () => { dispatchProps.push('/signup/verify-email?email=' + encodeURIComponent(email)) },
        (e) => { /* Error handled by login reducer but we need this here as a catch */ }
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
