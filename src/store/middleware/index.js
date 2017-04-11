import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import graphqlMiddleware from './graphql'
import graphqlErrorMiddleware from './graphqlError'
import apiMiddleware from './apiMiddleware'
import pendingMiddleware from './pendingMiddleware'

const middleware = compact([
  graphqlMiddleware,
  apiMiddleware(),
  graphqlErrorMiddleware,
  pendingMiddleware,
  promiseMiddleware,
  process.env.NODE_ENV === 'development' && createLogger({collapsed: true})
])

const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
  ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
  : compose

export default composeFn(
  applyMiddleware(...middleware)
)
