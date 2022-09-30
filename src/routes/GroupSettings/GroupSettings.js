import { get } from 'lodash/fp'
import React, { useEffect } from 'react'
import CustomViewsTab from './CustomViewsTab'
import DeleteSettingsTab from './DeleteSettingsTab'
import GroupSettingsTab from './GroupSettingsTab'
import ImportExportSettingsTab from './ImportExportSettingsTab'
import InviteSettingsTab from './InviteSettingsTab'
import MembershipRequestsTab from './MembershipRequestsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab'
import PrivacySettingsTab from './PrivacySettingsTab'
import RelatedGroupsTab from './RelatedGroupsTab'
import TopicsSettingsTab from './TopicsSettingsTab'
import ExportDataTab from './ExportDataTab'
import Loading from 'components/Loading'
import FullPageModal from 'routes/FullPageModal'
import { Redirect } from 'react-router'
import { groupUrl } from 'util/navigation'

import './GroupSettings.scss'

// NOTE: This area is also rendered and shared with the mobile app.
// When making changes here or in any of the settings tabs please
// confirm accurate rendering and function in the related mobile area.
export default function GroupSettings ({
  addPostToCollection,
  canModerate,
  createCollection,
  currentUser,
  deleteGroup,
  fetchCollectionPosts,
  fetchGroupSettings,
  fetchLocation,
  fetchPending,
  group,
  parentGroups,
  prerequisiteGroups,
  removePostFromCollection,
  reorderPostInCollection,
  updateGroupSettings,
  upload
}) {
  const slug = get('slug', group)

  useEffect(() => {
    group && fetchGroupSettings()
  }, [slug])

  if (!group) return <Loading />
  if (!canModerate) return <Redirect to={groupUrl(slug)} />

  return <FullPageModal goToOnClose={groupUrl(slug)}
    content={[
      {
        name: 'Settings',
        path: groupUrl(slug, 'settings'),
        component: <GroupSettingsTab
          fetchLocation={fetchLocation}
          fetchPending={fetchPending}
          currentUser={currentUser}
          group={group}
          parentGroups={parentGroups}
          prerequisiteGroups={prerequisiteGroups}
          updateGroupSettings={updateGroupSettings}
        />
      },
      {
        name: group.moderatorDescriptorPlural || 'Moderators',
        path: groupUrl(slug, 'settings/moderators'),
        component: <ModeratorsSettingsTab groupId={group.id} slug={group.slug} />
      },
      {
        name: 'Privacy & Access',
        path: groupUrl(slug, 'settings/privacy'),
        component: <PrivacySettingsTab group={group} slug={group.slug} updateGroupSettings={updateGroupSettings} parentGroups={parentGroups} fetchPending={fetchPending} />
      },
      {
        name: 'Custom Views',
        path: groupUrl(slug, 'settings/views'),
        component: <CustomViewsTab
          group={group}
          addPostToCollection={addPostToCollection}
          createCollection={createCollection}
          fetchCollectionPosts={fetchCollectionPosts}
          fetchPending={fetchPending}
          removePostFromCollection={removePostFromCollection}
          reorderPostInCollection={reorderPostInCollection}
          updateGroupSettings={updateGroupSettings}
        />
      },
      {
        name: 'Topics',
        path: groupUrl(slug, 'settings/topics'),
        component: <TopicsSettingsTab group={group} />
      },
      {
        name: 'Invite',
        path: groupUrl(slug, 'settings/invite'),
        component: <InviteSettingsTab group={group} />
      },
      {
        name: 'Join Requests',
        path: groupUrl(slug, 'settings/requests'),
        component: <MembershipRequestsTab
          group={group}
          currentUser={currentUser}
        />
      },
      {
        name: 'Related Groups',
        path: groupUrl(slug, 'settings/relationships'),
        component: <RelatedGroupsTab
          group={group}
          currentUser={currentUser}
        />
      },
      {
        name: '',
        path: groupUrl(slug, 'settings/import'),
        component: <ImportExportSettingsTab
          group={group}
          upload={upload}
        />
      },
      {
        name: 'Export Data',
        path: groupUrl(slug, 'settings/export'),
        component: <ExportDataTab
          group={group}
        />
      },
      {
        name: 'Delete',
        path: groupUrl(slug, 'settings/delete'),
        component: <DeleteSettingsTab group={group} deleteGroup={deleteGroup} />
      }
    ]}
  />
}
