import { createStore } from 'redux'
import createMiddleware from './middleware'
import orm from './models'
import rootReducer, { combinedReducers } from './reducers'

export function getEmptyState() {
  return combinedReducers({
    orm: orm.getEmptyState()
  }, {type: ''})
}

export default function (history, req) {
  return createStore(rootReducer, getEmptyState(), createMiddleware(history, req))
}
