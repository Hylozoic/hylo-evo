import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import getReturnToURL from 'store/selectors/getReturnToURL'
import { SET_RETURN_TO_URL, RESET_RETURN_TO_URL } from 'store/constants'

export function AuthRoute ({
  component, requireAuth, isLoggedIn, currentUser,
  returnToURL, setReturnToURL, resetReturnToURL, location,
  ...rest
}) {
  if (isLoggedIn && location.pathname === '/signup') {
    return <Route {...rest} render={props => <Redirect to={'/signup/upload-photo'} />} />
  } else if (isLoggedIn && returnToURL && !location.pathname.startsWith('/signup')) {
    resetReturnToURL()
    return <Route {...rest} render={props => <Redirect to={returnToURL} />} />
  } else if (!isLoggedIn && requireAuth) {
    setReturnToURL(location.pathname + location.search)
    return <Route {...rest} render={props => <Redirect to={'/login'} />} />
  } else {
    return <Route {...rest} render={props => React.createElement(component, props)} />
  }
}

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export function setReturnToURL (returnToURL) {
  return {
    type: SET_RETURN_TO_URL,
    payload: { returnToURL }
  }
}

export function resetReturnToURL (returnToURL) {
  return {type: RESET_RETURN_TO_URL}
}

export default connect(mapStateToProps, { setReturnToURL, resetReturnToURL })(AuthRoute)
