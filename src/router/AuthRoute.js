import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { pick } from 'lodash/fp'

function AuthRoute ({ component, loggedIn, ...rest }) {
  return <Route {...rest} render={props => loggedIn
    ? React.createElement(component, props)
    : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
}

export default connect(pick('loggedIn'))(AuthRoute)
