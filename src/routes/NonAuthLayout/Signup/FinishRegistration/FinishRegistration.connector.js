import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { signup } from '../Signup.store'

const getVerifiedEmail = createSelector(
  get('login'),
  get('verifiedEmail')
)

export function mapStateToProps (state, props) {
  const email = getVerifiedEmail(state) || props.cookies.get('verifiedEmail')
  return {
    error: getLoginError(state),
    email,
    returnToURL: getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  push,
  resetReturnToURL,
  signup
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
