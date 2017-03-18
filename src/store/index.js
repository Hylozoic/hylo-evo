import React from 'react'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { compact, flatten } from 'lodash'
import reducers from '../reducers'
import routes from '../routes'

const history = createHistory()

// const middleware = compact(flatten([
//   routerMiddleware(history)
// ]))

const middleware = routerMiddleware(history)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combineReducers({
    // ...reducers,
    router: routerReducer
  }),
  composeEnhancers(
    applyMiddleware(middleware)
  )
)

const app = <Provider store={store}>
  <ConnectedRouter history={history}>
    {routes}
  </ConnectedRouter>
</Provider>

export default app
