import { createStore } from 'redux'
import createMiddleware from './middleware'
import orm from './models'
import reducers from './reducers'
import { LOGOUT } from 'store/constants'

export const initialState = {
  orm: orm.getEmptyState()
}

export const rootReducer = (state, action) => {
  if (!action.error && action.type === LOGOUT) {
    state = initialState
  }

  return reducers(state, action)
}

export default function (history) {
  return createStore(rootReducer, initialState, createMiddleware(history))
}
