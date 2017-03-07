import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import App from 'App'
import eventsRoutes from 'Events/routes'
import uIKitRoutes from 'UIKit/routes'

export default
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      {eventsRoutes}
    </Route>
    {uIKitRoutes}
  </Router>
