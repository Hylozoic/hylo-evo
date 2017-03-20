import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import postsReducer from './postsReducer'

export default combineReducers({
  posts: postsReducer,
  router: routerReducer
})
