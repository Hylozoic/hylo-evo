import React from 'react'
import { StaticRouter } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory, createMemoryHistory } from 'history'
import RootRouter from 'routes/RootRouter'
import '../css/global/index.scss'

export const history = typeof window !== 'undefined'
  ? createBrowserHistory()
  : createMemoryHistory()

export function clientRouter () {
  require('client/rollbar') // set up handling of uncaught errors

  return (
    <ConnectedRouter history={history}>
      <RootRouter />
    </ConnectedRouter>
  )
}

// Current SSR setup is deprecated and to be removed. See https://github.com/Hylozoic/hylo-evo/issues/1069
export function serverRouter (req, context) {
  return (
    <StaticRouter location={req.url} context={context}>
      <RootRouter />
    </StaticRouter>
  )
}
