import { createStore } from 'redux'
import createMiddleware from './middleware'
import orm from './models'
import reducers from './reducers'

export const initialState = {
  orm: orm.getEmptyState()
}

export const rootReducer = (state, action) => {
  return reducers(state, action)
}

export default function (history, req) {
  return createStore(rootReducer, initialState, createMiddleware(history, req))
}
