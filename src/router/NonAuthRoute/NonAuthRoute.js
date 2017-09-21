import React from 'react'
import { Route } from 'react-router'
import RedirectRoute from 'router/RedirectRoute'

export const AUTH_ROUTES_ROOT = '/'

export default function NonAuthRoute ({
  component,
  isLoggedIn,
  location,
  ...rest
}) {
  if (isLoggedIn) {
    return <RedirectRoute {...rest} to={AUTH_ROUTES_ROOT} />
  }
  return <Route {...rest} render={props => React.createElement(component, props)} />
}
