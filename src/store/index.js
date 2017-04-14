import { createStore } from 'redux'
import createMiddleware from './middleware'
import orm from './models'
import reducers from './reducers'

const initialState = {
  orm: orm.getEmptyState()
}

export default function (history) {
  return createStore(reducers, initialState, createMiddleware(history))
}
