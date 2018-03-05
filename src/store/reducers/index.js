import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import orm from './ormReducer'
import login from 'store/reducers/login'
import pending from './pending'
// Local store
// generator-marker-local-store-import
import AuthRoute from 'router/AuthRoute/AuthRoute.store'
import SkillsSection from 'components/SkillsSection/SkillsSection.store'
import NetworkCommunities from 'routes/NetworkCommunities/NetworkCommunities.store'
import NetworkSettings from 'routes/NetworkSettings/NetworkSettings.store'
import PrimaryLayout from 'routes/PrimaryLayout/PrimaryLayout.store'
import PeopleSelector from 'components/PeopleSelector/PeopleSelector.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import PostEditor from 'components/PostEditor/PostEditor.store'
import AttachmentManager from 'components/PostEditor/AttachmentManager/AttachmentManager.store'
import MessageForm from 'components/MessageForm/MessageForm.store'
import Members from 'routes/Members/Members.store'
import ThreadList from 'components/ThreadList/ThreadList.store'
import ModeratorsSettings from 'routes/CommunitySettings/ModeratorsSettingsTab/ModeratorsSettingsTab.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import AllTopics from 'routes/AllTopics/AllTopics.store'
import Search from 'routes/Search/Search.store'
import queryResults from './queryResults'
import FeedList from 'components/FeedList/FeedList.store'
import JoinCommunity from 'routes/JoinCommunity/JoinCommunity.store'
import CreateCommunity from 'routes/CreateCommunity/CreateCommunity.store'
import CreateTopic from 'components/CreateTopic/CreateTopic.store'

import { handleSetState, composeReducers } from './util'

const combinedReducers = combineReducers({
  // Global store
  orm,
  router: routerReducer,
  login,
  pending,
  queryResults,

  // Local store (Component)
  // generator-marker-local-store-reducer
  AuthRoute,
  SkillsSection,
  NetworkCommunities,
  NetworkSettings,
  PrimaryLayout,
  PeopleSelector,
  MessageForm,
  PeopleTyping,
  HyloEditor,
  PostEditor,
  AttachmentManager,
  ThreadList,
  Members,
  FullPageModal,
  AllTopics,
  ModeratorsSettings,
  Search,
  FeedList,
  JoinCommunity,
  CreateCommunity,
  CreateTopic
})

export default composeReducers(combinedReducers, handleSetState)
