import { createStore } from 'redux'
import mixpanel from 'mixpanel-browser'
import createMiddleware from './middleware'
import orm from './models'
import reducers from './reducers'
import { LOGOUT } from 'store/constants'

mixpanel.init(process.env.MIXPANEL_KEY)

export const initialState = {
  orm: orm.getEmptyState(),
  mixpanel
}

export const rootReducer = (state, action) => {
  if (!action.error && action.type === LOGOUT) {
    state = initialState
  }

  return reducers(state, action)
}

export default function (history, req) {
  return createStore(rootReducer, initialState, createMiddleware(history, req))
}
