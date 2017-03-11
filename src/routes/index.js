import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import PrimaryLayout from './PrimaryLayout'
import eventsRoutes from './Events/routes'
import uIKitRoutes from './UIKit/routes'
import Feed from './Feed'

export default
  <Router history={hashHistory}>
    <Route path='/' component={PrimaryLayout}>
      <IndexRoute components={{content: Feed}} />
      // {eventsRoutes}
    </Route>
    // {uIKitRoutes}
  </Router>
