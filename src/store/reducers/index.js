import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'
import orm from './ormReducer'
import pending from './pending'
// Local store
// generator-marker-local-store-import
import NewMessageThread from 'components/NewMessageThread/NewMessageThread.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import MessageForm from 'components/MessageForm/MessageForm.store'
import CommunitiesSelector from 'components/CommunitiesSelector/CommunitiesSelector.store'
import Login from 'routes/Login/Login.store'
import MemberProfile from 'routes/MemberProfile/MemberProfile.store'
import Members from 'routes/Members/Members.store'
import ThreadList from 'components/ThreadList/ThreadList.store'
import queryResults from './queryResults'
import { handleSetState, composeReducers } from './util'

const combinedReducers = combineReducers({
  // Global store
  orm,
  router: routerReducer,
  pending,
  queryResults,

  // NOTE: Move local to PrimaryLayout?
  communitiesDrawerOpen: (state = false, { type }) => {
    if (type === TOGGLE_COMMUNITIES_DRAWER) return !state
    return state
  },

  // Local store (Component)
  // generator-marker-local-store-reducer
  NewMessageThread,
  MessageForm,
  PeopleTyping,
  HyloEditor,
  CommunitiesSelector,
  Login,
  ThreadList,
  MemberProfile,
  Members
})

export default composeReducers(combinedReducers, handleSetState)
