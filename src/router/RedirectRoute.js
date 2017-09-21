import React from 'react'
import { Redirect, Route } from 'react-router'

export default function RedirectRoute ({to, ...props}) {
  return <Route {...props} render={() => <Redirect to={to} />} />
}
