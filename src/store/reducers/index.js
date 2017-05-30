import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'
import orm from './ormReducer'
import pending from './pending'
// Local store
// generator-marker-local-store-import
import TopNav from 'routes/PrimaryLayout/components/TopNav/TopNav.store'
import PeopleSelector from 'components/PeopleSelector/PeopleSelector.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import MessageForm from 'components/MessageForm/MessageForm.store'
import Login from 'routes/Login/Login.store'
import Members from 'routes/Members/Members.store'
import ThreadList from 'components/ThreadList/ThreadList.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import AllTopics from 'routes/AllTopics/AllTopics.store'
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
  TopNav,
  PeopleSelector,
  MessageForm,
  PeopleTyping,
  HyloEditor,
  Login,
  ThreadList,
  Members,
  FullPageModal,
  AllTopics
})

export default composeReducers(combinedReducers, handleSetState)
