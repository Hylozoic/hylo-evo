import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { CHECK_LOGIN, LOGIN } from 'store/constants'

import ormReducer from './ormReducer'

export default combineReducers({
  orm: ormReducer,
  router: routerReducer,

  loggedIn: (state = false, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
    }
    return state
  }
})
