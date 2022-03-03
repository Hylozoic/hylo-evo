import React from 'react'
import { Route } from 'react-router'
import RedirectRoute from 'router/RedirectRoute'

export default function AuthRoute ({
  component,
  currentUser,
  isLoggedIn,
  location,
  nonAuthComponent,
  nonAuthOnly,
  requireAuth,
  requirePartial,
  returnToOnAuth,
  setReturnToURL,
  ...rest
}) {
  if (!isLoggedIn && nonAuthComponent) {
    return <Route {...rest} render={props => React.createElement(nonAuthComponent, props)} />
  }

  // If already logged in and going to signup or login route then redirect to the home page
  if (isLoggedIn === 'registered' && nonAuthOnly) {
    return <RedirectRoute to={'/'} />
  }

  // On mobile we want to only store the intended URL and forward to the
  // download app modal (which is currently on the Login component/page)
  // Specifically we don't want any components to do any work but this,
  // namely JoinGroup which utilizes returnToOnAuth) and may attempt
  // to auth the user with a token and send them into sign-up.
  if (isLoggedIn !== 'registered' && (requireAuth || returnToOnAuth)) {
    setReturnToURL(location.pathname + location.search)
  }

  if (isLoggedIn !== 'partial' && requirePartial) {
    return <RedirectRoute to={'/signup'} />
  }

  if (isLoggedIn === 'partial' && requireAuth) {
    return <RedirectRoute to={'/signup/finish'} />
  }

  if (!isLoggedIn && requireAuth) {
    return <RedirectRoute to={'/login'} />
  }

  return <Route {...rest} render={props => React.createElement(component, props)} />
}
