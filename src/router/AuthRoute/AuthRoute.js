import { get } from 'lodash/fp'
import React, { Component } from 'react'
import { Redirect, Route } from 'react-router'
import { isSignupPath } from 'routes/AuthLayout/AuthLayout'

export default class AuthRoute extends Component {
  render () {
    const {
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
    } = this.props
    const signupInProgress = get('settings.signupInProgress', currentUser)
    const onInitialSignupStep = location.pathname === '/signup'
    const isOnSignupPath = isSignupPath(location.pathname)
    const nextSignupStepPath = '/signup/upload-photo'

    if (isLoggedIn) {
      if (onInitialSignupStep || (signupInProgress && !isOnSignupPath)) {
        return <Route {...rest} render={props => <Redirect to={nextSignupStepPath} />} />
      }
      if (returnToURL && !signupInProgress) {
        resetReturnToURL()
        return <Route {...rest} render={props => <Redirect to={returnToURL} />} />
      }
    } else {
      if (requireAuth || returnToOnAuth) {
        setReturnToURL(location.pathname + location.search)
      }
      if (requireAuth) {
        return <Route {...rest} render={props => <Redirect to={'/login'} />} />
      }
    }
    return <Route {...rest} render={props => React.createElement(component, props)} />
  }
}
