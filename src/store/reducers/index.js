import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import postsReducer from './postsReducer'
import ormReducer from './ormReducer'

export default combineReducers({
  orm: ormReducer,
  posts: postsReducer,
  router: routerReducer
})
