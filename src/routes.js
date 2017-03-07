import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
// import App from 'App'
import GeneralLayout from 'layouts/GeneralLayout'
import eventsRoutes from 'events/routes'
import uIKitRoutes from 'ui-kit/routes'

export default
  <Router history={hashHistory}>
    <Route path='/' component={GeneralLayout}>
      {eventsRoutes}
    </Route>
    <Route path='/ui-kit'>{uIKitRoutes}</Route>
  </Router>
