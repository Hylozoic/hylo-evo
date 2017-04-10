import React from 'react'
import createHistory from 'history/createBrowserHistory'
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

export function clientRouter () {
  return <ConnectedRouter history={createHistory()}>
    {rootRoutes()}
  </ConnectedRouter>
}

export function serverRouter (req, context) {
  return <StaticRouter location={req.url} context={context}>
    {rootRoutes()}
  </StaticRouter>
}

function rootRoutes () {
  return <Switch>
    <Route path='/ui-kit' component={UIKit} />
    <NonAuthRoute path='/login' component={Login} />
    <NavigationHandler>
      <AuthRoute path='/' component={PrimaryLayout} />
    </NavigationHandler>
  </Switch>
}
