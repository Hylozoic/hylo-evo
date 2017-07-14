import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import orm from './ormReducer'
import pending from './pending'
// Local store
// generator-marker-local-store-import
import NetworkCommunities from 'routes/NetworkCommunities/NetworkCommunities.store'
import NetworkSettings from 'routes/NetworkSettings/NetworkSettings.store'
import PrimaryLayout from 'routes/PrimaryLayout/PrimaryLayout.store'
import TopNav from 'routes/PrimaryLayout/components/TopNav/TopNav.store'
import PeopleSelector from 'components/PeopleSelector/PeopleSelector.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import PostEditor from 'components/PostEditor/PostEditor.store'
import MessageForm from 'components/MessageForm/MessageForm.store'
import Login from 'routes/Login/Login.store'
import Members from 'routes/Members/Members.store'
import ThreadList from 'components/ThreadList/ThreadList.store'
import ModeratorsSettings from 'routes/CommunitySettings/ModeratorsSettingsTab/ModeratorsSettingsTab.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import AllTopics from 'routes/AllTopics/AllTopics.store'
import Search from 'routes/Search/Search.store'
import queryResults from './queryResults'
import { handleSetState, composeReducers } from './util'

const combinedReducers = combineReducers({
  // Global store
  orm,
  router: routerReducer,
  pending,
  queryResults,

  // Local store (Component)
  // generator-marker-local-store-reducer
  NetworkCommunities,
  NetworkSettings,
  PrimaryLayout,
  TopNav,
  PeopleSelector,
  MessageForm,
  PeopleTyping,
  HyloEditor,
  PostEditor,
  Login,
  ThreadList,
  Members,
  FullPageModal,
  AllTopics,
  ModeratorsSettings,
  Search
})

export default composeReducers(combinedReducers, handleSetState)
