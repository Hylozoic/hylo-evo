import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import ormReducer from './ormReducer'

export default combineReducers({
  orm: ormReducer,
  router: routerReducer
})
