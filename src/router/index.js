import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import NonAuthRoute from './NonAuthRoute'
import NonAuthLayout from 'routes/NonAuthLayout'
import LoginCheck from 'routes/NonAuthLayout/LoginCheck'
import UIKit from 'routes/UIKit'
import '../css/global/index.scss'

export function clientRouter (history) {
  require('client/rollbar') // set up handling of uncaught errors

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
  return <LoginCheck>
    <Switch>
      <Route path='/ui-kit' component={UIKit} />
      <NonAuthRoute path='/login' component={NonAuthLayout} />
      <NonAuthRoute path='/signup' exact component={NonAuthLayout} />
      <AuthRoute path='/' component={PrimaryLayout} />
    </Switch>
  </LoginCheck>
}
