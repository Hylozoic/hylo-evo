import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import orm from './ormReducer'
import hyloEditor from 'components/HyloEditor/store.js'
import {
  CHECK_LOGIN,
  FETCH_CURRENT_USER,
  LOGIN,
  LOGOUT,
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'

export default combineReducers({
  orm,
  router: routerReducer,
  hyloEditor,

  loggedIn: (state = false, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
      case LOGOUT: return false
    }
    return state
  },

  currentUser: (state = {}, { type, error, payload }) => {
    if (!error && type === FETCH_CURRENT_USER) return payload.data.me
    return state
  },

  communitiesDrawerOpen: (state = false, { type }) => {
    if (type === TOGGLE_COMMUNITIES_DRAWER) return !state
    return state
  }
})
