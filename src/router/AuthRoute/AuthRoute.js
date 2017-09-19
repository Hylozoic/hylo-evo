import { get } from 'lodash/fp'
import React, { Component } from 'react'
import { Redirect, Route } from 'react-router'

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
    const onInitialSignupStep = location.pathname === '/signup'
    const signupInProgress = get('settings.signupInProgress', currentUser) // location.pathname.startsWith('/signup')
    if (isLoggedIn) {
      if (onInitialSignupStep) {
        return <Route {...rest} render={props => <Redirect to={'/signup/upload-photo'} />} />
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
