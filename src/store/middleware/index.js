import { applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import apiMiddleware from './apiMiddleware'
import createLogger from 'redux-logger'
import { compact } from 'lodash'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middleware = compact([
  apiMiddleware(),
  promiseMiddleware,
  process.env.NODE_ENV === 'development' && createLogger({collapsed: true})
])

export default composeEnhancers(
  applyMiddleware(...middleware)
)
