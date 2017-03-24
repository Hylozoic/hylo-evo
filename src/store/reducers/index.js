import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import posts from './postsReducer'
import orm from './ormReducer'
import hyloEditor from 'components/HyloEditor/reducer.js'

export default combineReducers({
  orm,
  posts,
  hyloEditor,
  router: routerReducer
})
