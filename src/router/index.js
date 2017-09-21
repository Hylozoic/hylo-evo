import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import AuthLayout from 'routes/AuthLayout'
import AuthRoute from './AuthRoute'
import AuthCheck from './AuthCheck'
import RedirectRoute from 'router/RedirectRoute'
import legacyRedirectsMap from 'router/legacyRedirectsMap'
import JoinCommunity from 'routes/JoinCommunity'
import NonAuthLayout from 'routes/NonAuthLayout'
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
  const { match } = this.props
  return <AuthCheck>
    <Switch>
      {legacyRedirectsMap(match).forEach(redirect => <RedirectRoute {...redirect} />)}
      <Route path='/ui-kit' component={UIKit} />
      <AuthRoute returnToOnAuth path='/h/use-invitation' component={JoinCommunity} />
      <AuthRoute path='/login' component={NonAuthLayout} />
      <AuthRoute path='/signup' exact component={NonAuthLayout} />
      <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
      <AuthRoute requireAuth path='/' component={AuthLayout} />
    </Switch>
  </AuthCheck>
}
