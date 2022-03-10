import { get } from 'lodash/fp'
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

  // TODO: Ideally we would always have the currentUser set when isLoggedIn but right now we dont when using Auth with Service
  //       to fix we will have to switch all auth code to use GraphQL. For now we can handle not having a currentUser right after login and seems to work ok.
  const hasRegistered = get('hasRegistered', currentUser)

  // If already logged in and going to signup or login route then redirect to the home page
  if (isLoggedIn && !hasRegistered && nonAuthOnly) {
    return <RedirectRoute to={'/'} />
  }

  if (isLoggedIn && !hasRegistered && nonAuthOnly) {
    // TODO: this is acting weird, it is firing before we redirect to /signup/finish which resets the return to URL and throwing a warning/error
    //        I guess this is because the render here happens before the .then after verifyingEmail
    return <RedirectRoute to={'/signup/finish'} />
  }

  // On mobile we want to only store the intended URL and forward to the
  // download app modal (which is currently on the Login component/page)
  // Specifically we don't want any components to do any work but this,
  // namely JoinGroup which utilizes returnToOnAuth) and may attempt
  // to auth the user with a token and send them into sign-up.
  if ((!isLoggedIn || !hasRegistered) && (requireAuth || returnToOnAuth)) {
    setReturnToURL(location.pathname + location.search)
  }

  if (isLoggedIn && !hasRegistered && get('emailValidated', currentUser) && requireAuth) {
    return <RedirectRoute to={'/signup/finish'} />
  }

  if (!isLoggedIn && requireAuth) {
    return <RedirectRoute to={'/login'} />
  }

  return <Route {...rest} render={props => React.createElement(component, props)} />
}
