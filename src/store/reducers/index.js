import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import orm from './ormReducer'
import login from 'store/reducers/login'
import pending from './pending'
import locationHistory from './locationHistory'
import resetStore from './resetStore'
import mixpanel from './mixpanel'
import intercom from './intercom'
import holochain from './holochain'

// Local store
// generator-marker-local-store-import
import AuthRoute from 'router/AuthRoute/AuthRoute.store'
import SkillsSection from 'components/SkillsSection/SkillsSection.store'
import NetworkCommunities from 'routes/NetworkCommunities/NetworkCommunities.store'
import NetworkSettings from 'routes/NetworkSettings/NetworkSettings.store'
import PrimaryLayout from 'routes/PrimaryLayout/PrimaryLayout.store'
import ThreadList from 'routes/Messages/ThreadList/ThreadList.store'
import MessageForm from 'routes/Messages/MessageForm/MessageForm.store'
import PeopleSelector from 'routes/Messages/PeopleSelector/PeopleSelector.store'
import Members from 'routes/Members/Members.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import PostEditor from 'components/PostEditor/PostEditor.store'
import AttachmentManager from 'components/PostEditor/AttachmentManager/AttachmentManager.store'
import ModeratorsSettings from 'routes/CommunitySettings/ModeratorsSettingsTab/ModeratorsSettingsTab.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import AllTopics from 'routes/AllTopics/AllTopics.store'
import Search from 'routes/Search/Search.store'
import queryResults from './queryResults'
import FeedList from 'components/FeedList/FeedList.store'
import JoinCommunity from 'routes/JoinCommunity/JoinCommunity.store'
import CreateCommunity from 'routes/CreateCommunity/CreateCommunity.store'
import CreateTopic from 'components/CreateTopic/CreateTopic.store'
import MemberSelector from 'components/MemberSelector/MemberSelector.store'
import { history } from 'router'
import { handleSetState, composeReducers } from './util'

console.log('!!! history', history)
export const combinedReducers = combineReducers({
  // Global store
  orm,
  router: connectRouter(history),
  login,
  pending,
  queryResults,
  locationHistory,
  mixpanel,
  intercom,
  holochain,

  // Local store (Component)
  // generator-marker-local-store-reducer
  AuthRoute,
  SkillsSection,
  NetworkCommunities,
  NetworkSettings,
  PrimaryLayout,
  ThreadList,
  MessageForm,
  PeopleSelector,
  PeopleTyping,
  HyloEditor,
  PostEditor,
  AttachmentManager,
  Members,
  FullPageModal,
  AllTopics,
  ModeratorsSettings,
  Search,
  FeedList,
  JoinCommunity,
  CreateCommunity,
  CreateTopic,
  MemberSelector
})

export default composeReducers(
  combinedReducers,
  resetStore,
  handleSetState
)
