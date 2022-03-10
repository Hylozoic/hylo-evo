import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { mobileRedirect } from 'util/mobile'
import { login, loginWithService } from './Login.store'

export function mapStateToProps (state, props) {
  return {
    error: getLoginError(state) || getQuerystringParam('error', state, props),
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state),
    downloadAppUrl: mobileRedirect()
  }
}

export const mapDispatchToProps = {
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
