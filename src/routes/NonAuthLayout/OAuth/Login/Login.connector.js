import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import getRouteParam from 'store/selectors/getRouteParam'
import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { mobileRedirect } from 'util/mobile'
import { login } from './Login.store'

export function mapStateToProps (state, props) {
  const oauthUID = getRouteParam('uid', state, props)

  return {
    error: getLoginError(state),
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state),
    downloadAppUrl: mobileRedirect(),
    oauthUID
  }
}

export const mapDispatchToProps = {
  login,
  resetReturnToURL,
  push
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    login: (email, password) => { return dispatchProps.login(stateProps.oauthUID, email, password) },
    redirectOnSignIn: (defaultPath) => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
