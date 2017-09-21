import { get } from 'lodash/fp'
import React from 'react'
import { Route } from 'react-router'
import RedirectRoute from 'router/RedirectRoute'
import { isSignupPath } from 'routes/AuthLayout/AuthLayout'

export const STEP_1_SIGNUP_PATH = '/signup'
export const STEP_2_SIGNUP_PATH = '/signup/upload-photo'
export const LOGIN_PATH = '/login'

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
  const signupInProgress = get('settings.signupInProgress', currentUser)
  const onInitialSignupStep = location.pathname === STEP_1_SIGNUP_PATH
  const isOnSignupPath = isSignupPath(location.pathname)
  const nextSignupStepPath = STEP_2_SIGNUP_PATH

  if (isLoggedIn) {
    if (onInitialSignupStep || (signupInProgress && !isOnSignupPath)) {
      return <RedirectRoute {...rest} to={nextSignupStepPath} />
    }
    if (returnToURL && !signupInProgress) {
      resetReturnToURL()
      return <RedirectRoute {...rest} to={returnToURL} />
    }
  } else {
    if (requireAuth || returnToOnAuth) {
      setReturnToURL(location.pathname + location.search)
    }
    if (requireAuth) {
      return <RedirectRoute {...rest} to={LOGIN_PATH} />
    }
  }
  return <Route {...rest} render={props => React.createElement(component, props)} />
}
AuthRoute.defaultProps = {
  isLoggedIn: false,
  requireAuth: false,
  returnToOnAuth: false,
  location: {
    pathname: '',
    search: ''
  }
}
