import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import { isDev } from 'config'
import graphqlMiddleware from './graphqlMiddleware'
import holochainGraphqlMiddleware from './holochainGraphqlMiddleware'
import apiMiddleware from './apiMiddleware'
import holochainApiMiddleware from './holochainApiMiddleware'
import pendingMiddleware from './pendingMiddleware'
import optimisticMiddleware from './optimisticMiddleware'
import userFetchedMiddleware from './userFetchedMiddleware'
import userBlockingMiddleware from './userBlockingMiddleware'
import mixpanelMiddleware from './mixpanelMiddleware'
import errorMiddleware from './errorMiddleware'
import { routerMiddleware } from 'react-router-redux'

export default function createMiddleware (history, req) {
  const middleware = compact([
    routerMiddleware(history),
    graphqlMiddleware,
    holochainGraphqlMiddleware,
    apiMiddleware(req),
    holochainApiMiddleware(req),
    errorMiddleware,
    optimisticMiddleware,
    pendingMiddleware,
    promiseMiddleware,
    userFetchedMiddleware,
    userBlockingMiddleware,
    mixpanelMiddleware,
    !req && isDev && createLogger({collapsed: true})
  ])

  const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
    ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
    : compose

  return composeFn(
    applyMiddleware(...middleware)
  )
}
