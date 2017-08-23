import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import pickIsLoggedIn from 'store/selectors/pickIsLoggedIn'

function AuthRoute ({ component, isLoggedIn, ...rest }) {
  console.log('AuthRoute: ', isLoggedIn)
  return <Route {...rest} render={props => isLoggedIn
    ? React.createElement(component, props)
    : redirect(props)} />
}

export default connect(pickIsLoggedIn)(AuthRoute)

function redirect ({ location }) {
  return <Redirect to={{
    pathname: '/login',
    state: {from: location} // TODO: test this with server-side rendering
  }} />
}
