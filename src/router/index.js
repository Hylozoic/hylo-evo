import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import LoginCheck from 'routes/NonAuthLayout/LoginCheck'
import JoinGroup from 'routes/JoinGroup'
import NonAuthLayout from 'routes/NonAuthLayout'
import '../css/global/index.scss'
import ErrorBoundary from 'components/ErrorBoundary'

export const history = typeof window !== 'undefined'
  ? createBrowserHistory()
  : createMemoryHistory()

export function clientRouter () {
  require('client/rollbar') // set up handling of uncaught errors

  return <ConnectedRouter history={history}>
    {rootRoutes()}
  </ConnectedRouter>
}

export function serverRouter (req, context) {
  return <StaticRouter location={req.url} context={context}>
    {rootRoutes()}
  </StaticRouter>
}

function rootRoutes () {
  return <ErrorBoundary>
    <LoginCheck>
      <Switch>
        <AuthRoute returnToOnAuth path='/:context(groups)/:groupSlug/join/:accessCode' component={JoinGroup} />
        <AuthRoute returnToOnAuth path='/h/use-invitation' component={JoinGroup} />
        <AuthRoute path='/login' component={NonAuthLayout} />
        <AuthRoute path='/signup' exact component={NonAuthLayout} />
        <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
        <AuthRoute path='/:context(public)' nonAuthComponent={NonAuthLayout} component={PrimaryLayout} />
        <AuthRoute requireAuth path='/' component={PrimaryLayout} />
      </Switch>
    </LoginCheck>
  </ErrorBoundary>
}
