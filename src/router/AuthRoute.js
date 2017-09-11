import React from 'react'
import { get } from 'lodash/fp'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import getReturnToURL from 'store/selectors/getReturnToURL'
import { SET_RETURN_TO_URL, RESET_RETURN_TO_URL } from 'store/constants'

function AuthRoute ({
  component, requireAuth, isLoggedIn, isSigningUp, currentUser,
  returnToURL, setReturnToURL, resetReturnToURL, location,
  ...rest
}) {
  if (isLoggedIn) {
    return <Route {...rest} render={props => redirect(props)} />
  } else if (!isLoggedIn && requireAuth) {
    setReturnToURL(location.pathname + location.search)
    return <Route {...rest} render={props => loginRedirect(props)} />
  } else {
    return <Route {...rest} render={props => React.createElement(component, props)} />
  }
}

function redirect ({ location }) {
  return <Redirect to={get('state.from', location) || '/'} />
}

function loginRedirect ({ location }) {
  return <Redirect to={{
    pathname: '/login',
    state: {from: location} // TODO: test this with server-side rendering
  }} />
}

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    isSigningUp: getIsSigningUp(state),
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export default connect(mapStateToProps, { setReturnToURL, resetReturnToURL })(AuthRoute)

function setReturnToURL (returnToURL) {
  return {
    type: SET_RETURN_TO_URL,
    payload: { returnToURL }
  }
}

function resetReturnToURL (returnToURL) {
  return {type: RESET_RETURN_TO_URL}
}

// selector
import { createSelector } from 'reselect'

export const getIsSigningUp = createSelector(
  get('login'),
  get('isSigningUp')
)
