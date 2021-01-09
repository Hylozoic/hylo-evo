import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import orm from './ormReducer'
import login from 'store/reducers/login'
import pending from './pending'
import locationHistory from './locationHistory'
import resetStore from './resetStore'
import mixpanel from './mixpanel'
import intercom from './intercom'

// Local store
// generator-marker-local-store-import
import AuthRoute from 'router/AuthRoute/AuthRoute.store'
import SkillsSection from 'components/SkillsSection/SkillsSection.store'
import SkillsToLearnSection from 'components/SkillsToLearnSection/SkillsToLearnSection.store'
import PrimaryLayout from 'routes/PrimaryLayout/PrimaryLayout.store'
import Messages from 'routes/Messages/Messages.store'
import Members from 'routes/Members/Members.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import PostEditor from 'components/PostEditor/PostEditor.store'
import AttachmentManager from 'components/AttachmentManager/AttachmentManager.store'
import MapExplorer from 'routes/MapExplorer/MapExplorer.store'
import ModeratorsSettings from 'routes/GroupSettings/ModeratorsSettingsTab/ModeratorsSettingsTab.store'
import TopicsSettings from 'routes/GroupSettings/TopicsSettingsTab/TopicsSettingsTab.store'
import RelatedGroups from 'routes/GroupSettings/RelatedGroupsTab/RelatedGroupsTab.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import AllTopics from 'routes/AllTopics/AllTopics.store'
import SavedSearches from 'routes/UserSettings/UserSettings.store'
import UserGroupsTab from 'routes/UserSettings/UserGroupsTab/UserGroupsTab.store'
import Search from 'routes/Search/Search.store'
import queryResults from './queryResults'
import FeedList from 'components/FeedList/FeedList.store'
import MembershipRequests from 'routes/GroupSettings/MembershipRequestsTab/MembershipRequestsTab.store'
import GroupDetail from 'routes/GroupDetail/GroupDetail.store'
import JoinGroup from 'routes/JoinGroup/JoinGroup.store'
import CreateGroup from 'routes/CreateGroup/CreateGroup.store'
import CreateTopic from 'components/CreateTopic/CreateTopic.store'
import MemberSelector from 'components/MemberSelector/MemberSelector.store'
import { history } from 'router'
import { handleSetState, composeReducers } from './util'

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

  // Local store (Component)
  // generator-marker-local-store-reducer
  AllTopics,
  AuthRoute,
  AttachmentManager,
  CreateGroup,
  CreateTopic,
  FeedList,
  FullPageModal,
  HyloEditor,
  JoinGroup,
  MembershipRequests,
  GroupDetail,
  MapExplorer,
  Members,
  MemberSelector,
  Messages,
  ModeratorsSettings,
  PeopleTyping,
  PrimaryLayout,
  PostEditor,
  RelatedGroups,
  SavedSearches,
  Search,
  SkillsSection,
  SkillsToLearnSection,
  TopicsSettings,
  UserGroupsTab
})

export default composeReducers(
  combinedReducers,
  resetStore,
  handleSetState
)
