import { get, compact } from 'lodash/fp'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AgreementsTab from './AgreementsTab'
import CustomViewsTab from './CustomViewsTab'
import DeleteSettingsTab from './DeleteSettingsTab'
import GroupSettingsTab from './GroupSettingsTab'
import ImportExportSettingsTab from './ImportExportSettingsTab'
import InviteSettingsTab from './InviteSettingsTab'
import MembershipRequestsTab from './MembershipRequestsTab'
import ModeratorsSettingsTab from './ModeratorsSettingsTab'
import PrivacySettingsTab from './PrivacySettingsTab'
import RelatedGroupsTab from './RelatedGroupsTab'
import ResponsibilitiesTab from './ResponsibilitiesTab'
import TopicsSettingsTab from './TopicsSettingsTab'
import ExportDataTab from './ExportDataTab'
import Loading from 'components/Loading'
import FullPageModal from 'routes/FullPageModal'
import { push } from 'connected-react-router'
import { Redirect } from 'react-router'
import { groupUrl } from 'util/navigation'
import { RESP_ADD_MEMBERS, RESP_ADMINISTRATION } from 'store/constants'

import './GroupSettings.scss'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'

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
  fetchCollectionPostsPending,
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
  const { t } = useTranslation()

  useEffect(() => {
    group && fetchGroupSettings()
  }, [slug])

  const responsibilities = getResponsibilitiesForGroup({ currentUser, groupId: group?.id }).map(r => r.title)
  if (!group) return <Loading />
  if (!canModerate && responsibilities.length === 0) return <Redirect to={groupUrl(slug)} />

  useEffect(() => {
    if (!canModerate && !responsibilities.includes(RESP_ADMINISTRATION) && responsibilities.includes(RESP_ADD_MEMBERS)) push(groupUrl(slug, 'settings/invite'))
  }, [])

  const overallSettings = {
    name: t('Settings'),
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
  }

  const agreementSettings = {
    name: t('Agreements'),
    path: groupUrl(slug, 'settings/agreements'),
    component: <AgreementsTab group={group} />
  }

  const responsibilitiesSettings = {
    name: t('Responsibilities'),
    path: groupUrl(slug, 'settings/responsibilities'),
    component: <ResponsibilitiesTab groupId={group.id} group={group} slug={group.slug} />
  }

  const rolesSettings = {
    name: t('Roles & Badges'),
    path: groupUrl(slug, 'settings/roles'),
    component: <ModeratorsSettingsTab groupId={group.id} group={group} slug={group.slug} />
  }

  const accessSettings = {
    name: t('Privacy & Access'),
    path: groupUrl(slug, 'settings/privacy'),
    component: <PrivacySettingsTab group={group} slug={group.slug} updateGroupSettings={updateGroupSettings} parentGroups={parentGroups} fetchPending={fetchPending} />
  }

  const customViewsSettings = {
    name: t('Custom Views'),
    path: groupUrl(slug, 'settings/views'),
    component: <CustomViewsTab
      group={group}
      addPostToCollection={addPostToCollection}
      createCollection={createCollection}
      fetchCollectionPosts={fetchCollectionPosts}
      fetchCollectionPostsPending={fetchCollectionPostsPending}
      fetchPending={fetchPending}
      removePostFromCollection={removePostFromCollection}
      reorderPostInCollection={reorderPostInCollection}
      updateGroupSettings={updateGroupSettings}
    />
  }

  const topicsSettings = {
    name: t('Topics'),
    path: groupUrl(slug, 'settings/topics'),
    component: <TopicsSettingsTab group={group} />
  }

  const inviteSettings = {
    name: t('Invite'),
    path: groupUrl(slug, 'settings/invite'),
    component: <InviteSettingsTab group={group} />
  }

  const joinRequestSettings = {
    name: t('Join Requests'),
    path: groupUrl(slug, 'settings/requests'),
    component: <MembershipRequestsTab
      group={group}
      currentUser={currentUser}
    />
  }

  const relatedGroupsSettings = {
    name: t('Related Groups'),
    path: groupUrl(slug, 'settings/relationships'),
    component: <RelatedGroupsTab
      group={group}
      currentUser={currentUser}
    />
  }

  const importSettings = {
    name: '',
    path: groupUrl(slug, 'settings/import'),
    component: <ImportExportSettingsTab
      group={group}
      upload={upload}
    />
  }

  const exportSettings = {
    name: t('Export Data'),
    path: groupUrl(slug, 'settings/export'),
    component: <ExportDataTab
      group={group}
    />
  }

  const deleteSettings = {
    name: t('Delete'),
    path: groupUrl(slug, 'settings/delete'),
    component: <DeleteSettingsTab group={group} deleteGroup={deleteGroup} />
  }

  return (
    <FullPageModal
      goToOnClose={groupUrl(slug)}
      content={compact([
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? overallSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? agreementSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? responsibilitiesSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? rolesSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? accessSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? customViewsSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? topicsSettings : null,
        canModerate || responsibilities.includes(RESP_ADD_MEMBERS) ? inviteSettings : null,
        canModerate || responsibilities.includes(RESP_ADD_MEMBERS) ? joinRequestSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? relatedGroupsSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? importSettings : null,
        canModerate || responsibilities.includes(RESP_ADMINISTRATION) ? exportSettings : null,
        canModerate ? deleteSettings : null
      ])}
    />
  )
}
