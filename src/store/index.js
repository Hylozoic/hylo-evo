import { createStore } from 'redux'
import createMiddleware from './middleware'
import { createBrowserHistory } from 'history'
import createRootReducer, { createCombinedReducers } from './reducers'

// `window` check here is for SSR case (see `appMiddleware`)
// where a static memory history is passed
export const history = typeof window !== 'undefined' && createBrowserHistory()

export function getEmptyState (providedHistory = history) {
  const combinedReducers = createCombinedReducers(providedHistory)

  return combinedReducers({}, { type: '' })
}

export default function configureStore (providedHistory = history, req) {
  return createStore(
    createRootReducer(providedHistory),
    getEmptyState(providedHistory),
    createMiddleware(providedHistory, req)
  )
}
