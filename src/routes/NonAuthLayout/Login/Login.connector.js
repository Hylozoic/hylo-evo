import { connect } from 'react-redux'
import getLoginError from 'store/selectors/getLoginError'
import { checkLogin, login, loginWithService } from './Login.store'
import { push } from 'react-router-redux'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import mobileRedirect from 'utils/mobileRedirect'

export function mapStateToProps (state, props) {
  return {
    error: getLoginError(state),
    returnToURL: getReturnToURL(state),
    downloadAppUrl: mobileRedirect()
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
