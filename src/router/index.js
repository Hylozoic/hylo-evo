import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import LoginCheck from 'routes/NonAuthLayout/LoginCheck'
import JoinCommunity from 'routes/JoinCommunity'
import NonAuthLayout from 'routes/NonAuthLayout'
import UIKit from 'routes/UIKit'
import '../css/global/index.scss'
import ErrorBoundary from 'components/ErrorBoundary'
import mobileRedirect from 'util/mobileRedirect'

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
  const isMobile = mobileRedirect()

  return <ErrorBoundary>
    <LoginCheck>
      <Switch>
        <Route path='/ui-kit' component={UIKit} />
        {!isMobile && <AuthRoute returnToOnAuth path='/c/:slug/join/:accessCode' component={JoinCommunity} />}
        {!isMobile && <AuthRoute returnToOnAuth path='/h/use-invitation' component={JoinCommunity} />}
        <AuthRoute path='/login' component={NonAuthLayout} />
        <AuthRoute path='/signup' exact component={NonAuthLayout} />
        <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
        <AuthRoute requireAuth path='/' component={PrimaryLayout} />
      </Switch>
    </LoginCheck>
  </ErrorBoundary>
}
