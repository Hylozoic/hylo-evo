import { combineReducers } from 'redux'
import { router as routerReducer } from 'react-router-redux'
import {
  CHECK_LOGIN,
  FETCH_CURRENT_USER,
  LOGIN,
  LOGOUT
} from 'store/constants'
import orm from './ormReducer'
import HyloEditor from 'components/HyloEditor/store.js'
import CommunitiesSelector from 'components/CommunitiesSelector/store.js'

export default combineReducers({
  orm,
  routerReducer,
  HyloEditor,
  CommunitiesSelector,

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
  }
})
