import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { pick } from 'lodash/fp'

function NonAuthRoute ({ component, loggedIn, ...rest }) {
  return <Route {...rest} render={props => !loggedIn
    ? React.createElement(component, props)
    : <Redirect to={{pathname: '/', state: {from: props.location}}} />} />
}

export default connect(pick('loggedIn'))(NonAuthRoute)
