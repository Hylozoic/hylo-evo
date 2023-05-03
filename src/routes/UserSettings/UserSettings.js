import React, { Component } from 'react'
import { isEmpty } from 'lodash/fp'
import EditProfileTab from './EditProfileTab/EditProfileTab'
import UserGroupsTab from './UserGroupsTab/'
import BlockedUsersTab from './BlockedUsersTab/BlockedUsersTab'
import ManageInvitesTab from './ManageInvitesTab/'
import NotificationSettingsTab from './NotificationSettingsTab/NotificationSettingsTab'
import AccountSettingsTab from './AccountSettingsTab/AccountSettingsTab'
import PaymentSettingsTab from './PaymentSettingsTab/PaymentSettingsTab'
import SavedSearchesTab from './SavedSearchesTab/SavedSearchesTab'
import FullPageModal from 'routes/FullPageModal'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import './UserSettings.scss'
import { withTranslation } from 'react-i18next'

// NOTE: This area is also rendered and shared with the mobile app.
// When making changes here or in any of the settings tabs please
// confirm accurate rendering and function in the related mobile area.
class UserSettings extends Component {
  render () {
    const {
      currentUser,
      memberships,
      blockedUsers,
      unBlockUser,
      updateUserSettings,
      loginWithService,
      unlinkAccount,
      setConfirm,
      updateMembershipSettings,
      updateAllMemberships,
      messageSettings,
      allGroupsSettings,
      fetchPending,
      queryParams,
      registerStripeAccount,
      fetchLocation,
      deleteMe,
      deactivateMe,
      logout,
      t
    } = this.props

    const content = [
      {
        name: t('Edit Profile'),
        path: '/settings',
        component: <EditProfileTab
          currentUser={currentUser}
          updateUserSettings={updateUserSettings}
          loginWithService={loginWithService}
          unlinkAccount={unlinkAccount}
          setConfirm={setConfirm}
          fetchLocation={fetchLocation}
          fetchPending={fetchPending} />
      },
      {
        name: t('Groups & Affiliations'),
        path: '/settings/groups',
        component: <UserGroupsTab personId={currentUser.id} />
      },
      {
        name: t('Invites & Requests'),
        path: '/settings/invitations',
        component: <ManageInvitesTab currentUser={currentUser} />
      },
      {
        name: t('Notifications'),
        path: '/settings/notifications',
        component: <NotificationSettingsTab
          currentUser={currentUser}
          updateUserSettings={updateUserSettings}
          memberships={memberships}
          updateMembershipSettings={updateMembershipSettings}
          updateAllMemberships={updateAllMemberships}
          messageSettings={messageSettings}
          allGroupsSettings={allGroupsSettings} />
      },
      {
        name: t('Account'),
        path: '/settings/account',
        component: <AccountSettingsTab
          currentUser={currentUser}
          deactivateMe={deactivateMe}
          deleteMe={deleteMe}
          logout={logout}
          setConfirm={setConfirm}
          updateUserSettings={updateUserSettings} />
      },
      {
        name: t('Saved Searches'),
        path: '/settings/saved-searches',
        component: <SavedSearchesTab />
      }
    ]

    if (currentUser && !isEmpty(currentUser.blockedUsers.toRefArray())) {
      content.push({
        name: t('Blocked Users'),
        path: '/settings/blocked-users',
        component: <BlockedUsersTab
          blockedUsers={blockedUsers}
          unBlockUser={unBlockUser}
          loading={fetchPending} />
      })
    }

    if (currentUser && currentUser.hasFeature(PROJECT_CONTRIBUTIONS)) {
      content.push({
        name: t('Payment'),
        path: '/settings/payment',
        component: <PaymentSettingsTab
          currentUser={currentUser}
          updateUserSettings={updateUserSettings}
          setConfirm={setConfirm}
          queryParams={queryParams}
          registerStripeAccount={registerStripeAccount} />
      })
    }

    return <FullPageModal content={content} />
  }
}

export default withTranslation()(UserSettings)
