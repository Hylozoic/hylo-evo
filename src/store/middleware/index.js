import { applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middleware = [
  thunkMiddleware
]

export default composeEnhancers(
  applyMiddleware(...middleware)
)
