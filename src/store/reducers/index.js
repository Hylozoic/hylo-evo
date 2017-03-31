import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import orm from './ormReducer'
import hyloEditor from 'components/HyloEditor/store.js'
import { CHECK_LOGIN, FETCH_CURRENT_USER, LOGIN } from 'store/constants'
export default combineReducers({
  orm,
  router: routerReducer,
  hyloEditor,

  loggedIn: (state = false, { type, error, payload, meta }) => {
    if (error) return state
    switch (type) {
      case LOGIN: return true
      case CHECK_LOGIN: return !!payload.signedIn
    }
    return state
  },

  currentUser: (state = {}, { type, error, payload }) => {
    if (!error && type === FETCH_CURRENT_USER) return payload.data.me
    return state
  }
})
