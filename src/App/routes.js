import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from 'App'
import eventsRoutes from 'Events/routes'
import uIKitRoutes from 'UIKit/routes'
import Feed from 'Feed'

export default
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute components={{content: Feed}} />
      {eventsRoutes}
    </Route>
    {uIKitRoutes}
  </Router>
