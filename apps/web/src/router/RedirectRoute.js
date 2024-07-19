import React from 'react'
import { Redirect, Route } from 'react-router'

export default function RedirectRoute ({ to, ...routeProps }) {
  return <Route {...routeProps} render={props => <Redirect to={to} />} />
}
