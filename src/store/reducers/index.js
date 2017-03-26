import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import posts from './postsReducer'
import orm from './ormReducer'
import hyloEditor from 'components/HyloEditor/store.js'

export default combineReducers({
  orm,
  posts,
  hyloEditor,
  router: routerReducer
})
