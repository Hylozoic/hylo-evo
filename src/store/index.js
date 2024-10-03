import { createStore } from 'redux'
import createMiddleware from './middleware'
import { createBrowserHistory } from 'history'
import { createReduxHistoryContext } from "redux-first-history";
import createRootReducer, { createCombinedReducers } from './reducers'

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() })

export function getEmptyState () {
  const combinedReducers = createCombinedReducers(routerReducer)
  return combinedReducers({}, { type: '' })
}

const store = createStore(
  createRootReducer(routerReducer),
  getEmptyState(),
  createMiddleware(routerMiddleware)
)

export const history = createReduxHistory(store)

export default store
