import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import orm from './ormReducer'
import pending from './pending'
import hyloEditor from 'components/HyloEditor/store'
import {
  FETCH_CURRENT_USER,
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'
import login from 'routes/Login/store'
import navigation from 'routes/NavigationHandler/store'

export default combineReducers({
  orm,
  router: routerReducer,
  hyloEditor,
  login,
  pending,
  navigation,

  currentUser: (state = {}, { type, error, payload }) => {
    if (!error && type === FETCH_CURRENT_USER) return payload.data.me
    return state
  },

  communitiesDrawerOpen: (state = false, { type }) => {
    if (type === TOGGLE_COMMUNITIES_DRAWER) return !state
    return state
  }
})
