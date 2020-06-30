import qs from 'querystring'
import { connect } from 'react-redux'
import getLoginError from 'store/selectors/getLoginError'
import { checkLogin, login, loginWithService } from './Login.store'
import { push } from 'connected-react-router'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import mobileRedirect from 'util/mobileRedirect'

export function mapStateToProps (state, props) {
  const queryParams = qs.parse(props.location.search.substring(1))
  return {
    error: getLoginError(state),
    returnToURL: queryParams['returnToUrl'] || getReturnToURL(state),
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
