import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'
import orm from './ormReducer'
import pending from './pending'
// Local store
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import CommunitiesSelector from 'components/CommunitiesSelector/CommunitiesSelector.store'
import Login from 'routes/Login/store'

export default combineReducers({
  // Global store
  orm,
  router: routerReducer,
  pending,

  // NOTE: Move local to PrimaryLayout?
  communitiesDrawerOpen: (state = false, { type }) => {
    if (type === TOGGLE_COMMUNITIES_DRAWER) return !state
    return state
  },

  // Local store (Component)
  HyloEditor,
  CommunitiesSelector,
  Login
})
