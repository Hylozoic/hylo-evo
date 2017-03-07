import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import ReactDOM from 'react-dom'
import App from 'app/App'
import eventsRoutes from 'events/index'
import uIKitRoutes from 'ui-kit/index'

const routes =
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      {eventsRoutes}
    </Route>
    {uIKitRoutes}
  </Router>

ReactDOM.render(routes, document.getElementById('root'))
