import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { pickIsLoggedIn } from 'routes/Login/store'

function AuthRoute ({ component, isLoggedIn, ...rest }) {
  return <Route {...rest} render={props => isLoggedIn
    ? React.createElement(component, props)
    : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
}

export default connect(pickIsLoggedIn)(AuthRoute)
