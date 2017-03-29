import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import graphqlMiddleware from './graphql'
import apiMiddleware from './apiMiddleware'
import normalizingMiddleware from './normalizingMiddleware'

const middleware = compact([
  graphqlMiddleware,
  apiMiddleware(),
  promiseMiddleware,
  normalizingMiddleware,
  process.env.NODE_ENV === 'development' && createLogger({collapsed: true})
])

const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
  ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
  : compose

export default composeFn(
  applyMiddleware(...middleware)
)
