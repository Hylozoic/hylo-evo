import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import PrimaryLayout from 'routes/PrimaryLayout'
import NavigationHandler from 'routes/NavigationHandler'
import UIKit from '../routes/UIKit'
import AuthRoute from './AuthRoute'
import NonAuthRoute from './NonAuthRoute'
import Login from 'routes/Login'
import '../css/global/index.scss'

export function clientRouter (history) {
  return <ConnectedRouter history={history}>
    {rootRoutes()}
  </ConnectedRouter>
}

// TODO: this probably needs to get the history as well
export function serverRouter (req, context) {
  return <StaticRouter location={req.url} context={context}>
    {rootRoutes()}
  </StaticRouter>
}

function rootRoutes () {
  return <NavigationHandler>
    <Switch>
      <Route path='/ui-kit' component={UIKit} />
      <NonAuthRoute path='/login' component={Login} />
      <AuthRoute path='/' component={PrimaryLayout} />
    </Switch>
  </NavigationHandler>
}
