import { applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import apiMiddleware from './apiMiddleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middleware = [
  apiMiddleware(),
  promiseMiddleware
]

export default composeEnhancers(
  applyMiddleware(...middleware)
)
