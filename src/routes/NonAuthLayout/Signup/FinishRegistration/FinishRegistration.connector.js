import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import getLoginError from 'store/selectors/getLoginError'
import getMe from 'store/selectors/getMe'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { register } from '../Signup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)

  return {
    currentUser,
    error: getLoginError(state),
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  push,
  resetReturnToURL,
  register
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
