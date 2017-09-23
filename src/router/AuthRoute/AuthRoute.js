import React from 'react'
import { Route } from 'react-router'
import RedirectRoute from 'router/RedirectRoute'

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
    return <RedirectRoute to={'/signup/upload-photo'} />
  }
  if (!isLoggedIn && (requireAuth || returnToOnAuth)) {
    setReturnToURL(location.pathname + location.search)
  }
  if (!isLoggedIn && requireAuth) {
    return <RedirectRoute to={'/login'} />
  }
  return <Route {...rest} render={props => React.createElement(component, props)} />
}
