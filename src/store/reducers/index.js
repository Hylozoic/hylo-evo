import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { history } from 'router'

import orm from './ormReducer'
import returnToPath from 'store/reducers/returnToPath'
import graphqlResponseError from 'store/reducers/graphqlResponseError'
import pending from './pending'
import locationHistory from './locationHistory'
import resetStore from './resetStore'
import mixpanel from './mixpanel'
import intercom from './intercom'
import queryResults from './queryResults'
import { handleSetState, composeReducers } from './util'

// Local store
// generator-marker-local-store-import
import AllTopics from 'routes/AllTopics/AllTopics.store'
import AttachmentManager from 'components/AttachmentManager/AttachmentManager.store'
import CreateGroup from 'components/CreateGroup/CreateGroup.store'
import CreateTopic from 'components/CreateTopic/CreateTopic.store'
import Events from 'routes/Events/Events.store'
import FeedList from 'components/FeedList/FeedList.store'
import FullPageModal from 'routes/FullPageModal/FullPageModal.store'
import HyloEditor from 'components/HyloEditor/HyloEditor.store'
import MapExplorer from 'routes/MapExplorer/MapExplorer.store'
import Messages from 'routes/Messages/Messages.store'
import Members from 'routes/Members/Members.store'
import MembershipRequests from 'routes/GroupSettings/MembershipRequestsTab/MembershipRequestsTab.store'
import MemberSelector from 'components/MemberSelector/MemberSelector.store'
import ModeratorsSettings from 'routes/GroupSettings/ModeratorsSettingsTab/ModeratorsSettingsTab.store'
import PeopleTyping from 'components/PeopleTyping/PeopleTyping.store'
import PostEditor from 'components/PostEditor/PostEditor.store'
import AuthLayoutRouter from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'
import RelatedGroups from 'routes/GroupSettings/RelatedGroupsTab/RelatedGroupsTab.store'
import SavedSearches from 'routes/UserSettings/UserSettings.store'
import Search from 'routes/Search/Search.store'
import SkillsSection from 'components/SkillsSection/SkillsSection.store'
import SkillsToLearnSection from 'components/SkillsToLearnSection/SkillsToLearnSection.store'
import TopicsSettings from 'routes/GroupSettings/TopicsSettingsTab/TopicsSettingsTab.store'
import UserGroupsTab from 'routes/UserSettings/UserGroupsTab/UserGroupsTab.store'

export const combinedReducers = combineReducers({
  // Global store
  orm,
  router: connectRouter(history),
  returnToPath,
  graphqlResponseError,
  pending,
  queryResults,
  locationHistory,
  mixpanel,
  intercom,

  // Local store (Component)
  // generator-marker-local-store-reducer
  AllTopics,
  AttachmentManager,
  CreateGroup,
  CreateTopic,
  Events,
  FeedList,
  FullPageModal,
  HyloEditor,
  MembershipRequests,
  MapExplorer,
  Members,
  MemberSelector,
  Messages,
  ModeratorsSettings,
  PeopleTyping,
  AuthLayoutRouter,
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
