import React from 'react'
import { Redirect, Route } from 'react-router'

export default function AuthRoute ({
  component,
  requireAuth,
  isLoggedIn,
  currentUser,
  returnToOnAuth,
  returnToURL,
  setReturnToURL,
  resetReturnToURL,
  location,
  ...rest
}) {
  if (isLoggedIn && location.pathname === '/signup') {
    return <Route {...rest} render={props => <Redirect to={'/signup/upload-photo'} />} />
  }
  if (!isLoggedIn && (requireAuth || returnToOnAuth)) {
    setReturnToURL(location.pathname + location.search)
  }
  if (!isLoggedIn && requireAuth) {
    return <Route {...rest} render={props => <Redirect to={'/login'} />} />
  }
  return <Route {...rest} render={props => React.createElement(component, props)} />
}
