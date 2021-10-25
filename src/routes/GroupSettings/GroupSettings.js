import React, { useEffect } from 'react'
import { get } from 'lodash/fp'
import './GroupSettings.scss'
import GroupSettingsTab from './GroupSettingsTab'
import MembershipRequestsTab from './MembershipRequestsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab'
import ImportExportSettingsTab from './ImportExportSettingsTab'
import InviteSettingsTab from './InviteSettingsTab'
import DeleteSettingsTab from './DeleteSettingsTab'
import RelatedGroupsTab from './RelatedGroupsTab'
import TopicsSettingsTab from './TopicsSettingsTab'
import ExportDataTab from './ExportDataTab'
import Loading from 'components/Loading'
import FullPageModal from 'routes/FullPageModal'
import { Redirect } from 'react-router'
import { groupUrl } from 'util/navigation'

// NOTE: This area is also rendered and shared with the mobile app.
// When making changes here or in any of the settings tabs please
// confirm accurate rendering and functiong in the related mobile area.
export default function GroupSettings ({
  canModerate,
  currentUser,
  deleteGroup,
  group,
  parentGroups,
  prerequisiteGroups,
  updateGroupSettings,
  fetchGroupSettings,
  upload
}) {
  const slug = get('slug', group)

  useEffect(() => {
    group && fetchGroupSettings()
  }, slug)

  if (!group) return <Loading />
  if (!canModerate) return <Redirect to={groupUrl(slug)} />

  return <FullPageModal goToOnClose={groupUrl(slug)}
    content={[
      {
        name: 'Settings',
        path: groupUrl(slug, 'settings'),
        component: <GroupSettingsTab
          currentUser={currentUser}
          group={group}
          parentGroups={parentGroups}
          prerequisiteGroups={prerequisiteGroups}
          updateGroupSettings={updateGroupSettings}
        />
      },
      {
        name: 'Moderators',
        path: groupUrl(slug, 'settings/moderators'),
        component: <ModeratorsSettingsTab groupId={group.id} slug={group.slug} />
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
