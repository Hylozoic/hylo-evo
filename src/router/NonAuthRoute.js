import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { pickIsLoggedIn } from 'routes/Login/store'
import { get } from 'lodash/fp'

function NonAuthRoute ({ component, isLoggedIn, ...rest }) {
  return <Route {...rest} render={props => !isLoggedIn
    ? React.createElement(component, props)
    : redirect(props)} />
}

export default connect(pickIsLoggedIn)(NonAuthRoute)

function redirect ({ location }) {
  return <Redirect to={get('state.from', location) || '/'} />
}
