import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { LOGIN } from 'store/constants'

import ormReducer from './ormReducer'

export default combineReducers({
  orm: ormReducer,
  router: routerReducer,

  loggedIn: (state = false, { type, error, payload, meta }) => {
    if (!error && type === LOGIN) return true
    return state
  }
})
