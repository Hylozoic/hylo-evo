import React from 'react'
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
  console.log('isSigningUp: ', isSigningUp)
  if (isLoggedIn && returnToURL && !isSigningUp) {
    resetReturnToURL()
    return <Redirect to={returnToURL} />
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
import { get } from 'lodash/fp'

export const getIsSigningUp = createSelector(
  get('login'),
  get('isSigningUp')
)
