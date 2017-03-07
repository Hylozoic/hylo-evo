import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import GeneralLayout from 'layout/GeneralLayout'
import EventsRoutes from 'events/routes.js'
import UIKitRoutes from 'ui-kit/routes'

export default
  <Router history={hashHistory}>
    <Route path='/' component={GeneralLayout}>
      {EventsRoutes}
    </Route>
    {UIKitRoutes}
  </Router>
