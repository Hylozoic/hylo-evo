import React from 'react'
import { Route } from 'react-router'
import RedirectRoute from 'router/RedirectRoute'
import mobileRedirect from 'util/mobileRedirect'

export default function AuthRoute ({
  component,
  requireAuth,
  isLoggedIn,
  currentUser,
  returnToOnAuth,
  setReturnToURL,
  location,
  ...rest
}) {
  const isMobile = mobileRedirect()
  if (isLoggedIn && location.pathname === '/signup') {
    return <RedirectRoute to={'/signup/upload-photo'} />
  }
  // On mobile we want to only store the intended URL and forward to the
  // download app modal (which is currently on the Login component/page)
  // Specifically we don't want any components to do any work but this,
  // namely JoinCommunity which utilizes returnToOnAuth) and may attempt
  // to auth the user with a token and send them into sign-up.
  if ((isMobile && requireAuth) || (!isMobile && !isLoggedIn && (requireAuth || returnToOnAuth))) {
    setReturnToURL(location.pathname + location.search)
  }
  if (!isLoggedIn && requireAuth) {
    return <RedirectRoute to={'/login'} />
  }
  return <Route {...rest} render={props => React.createElement(component, props)} />
}
