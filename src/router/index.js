import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { StaticRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import PrimaryLayout from '../routes/PrimaryLayout'
import UIKit from '../routes/UIKit'

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
    <Route path='/' component={PrimaryLayout} />
  </Switch>
}
