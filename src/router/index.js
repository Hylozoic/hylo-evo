import React from 'react'
import { StaticRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import PrimaryLayout from 'routes/PrimaryLayout'
import AuthRoute from './AuthRoute'
import LoginCheck from 'routes/NonAuthLayout/LoginCheck'
import JoinCommunity from 'routes/JoinCommunity'
import NonAuthLayout from 'routes/NonAuthLayout'
import '../css/global/index.scss'
import ErrorBoundary from 'components/ErrorBoundary'

// export const history = createBrowserHistory()

export const history = typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory()

export function clientRouter () {
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
  return <ErrorBoundary>
    <LoginCheck>
      <Switch>
        <AuthRoute returnToOnAuth path='/c/:slug/join/:accessCode' component={JoinCommunity} />
        <AuthRoute returnToOnAuth path='/h/use-invitation' component={JoinCommunity} />
        <AuthRoute path='/login' component={NonAuthLayout} />
        <AuthRoute path='/signup' exact component={NonAuthLayout} />
        <AuthRoute path='/reset-password' exact component={NonAuthLayout} />
        <AuthRoute requireAuth path='/' component={PrimaryLayout} />
      </Switch>
    </LoginCheck>
  </ErrorBoundary>
}
