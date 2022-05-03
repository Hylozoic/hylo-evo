import { createStore } from 'redux'
import createMiddleware from './middleware'
import rootReducer, { combinedReducers } from './reducers'

export function getEmptyState () {
  return combinedReducers({}, { type: '' })
}

export default function (history, req) {
  return createStore(rootReducer, getEmptyState(), createMiddleware(history, req))
}
