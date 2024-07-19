import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import { routerMiddleware } from 'connected-react-router'
import { isDev } from 'config'
import graphqlMiddleware from './graphqlMiddleware'
import apiMiddleware from './apiMiddleware'
import pendingMiddleware from './pendingMiddleware'
import optimisticMiddleware from './optimisticMiddleware'
import userBlockingMiddleware from './userBlockingMiddleware'
import mixpanelMiddleware from './mixpanelMiddleware'
import rollbarMiddleware from './rollbarMiddleware'

export default function createMiddleware (history, req) {
  const middleware = compact([
    routerMiddleware(history),
    graphqlMiddleware,
    apiMiddleware(req),
    optimisticMiddleware,
    pendingMiddleware,
    promiseMiddleware,
    userBlockingMiddleware,
    mixpanelMiddleware,
    rollbarMiddleware,
    !req && isDev && createLogger({ collapsed: true })
  ])

  const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
    ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
    : compose

  return composeFn(
    applyMiddleware(...middleware)
  )
}
