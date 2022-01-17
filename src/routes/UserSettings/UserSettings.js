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

// NOTE: This area is also rendered and shared with the mobile app.
// When making changes here or in any of the settings tabs please
// confirm accurate rendering and function in the related mobile area.
export default class UserSettings extends Component {
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
      logout
    } = this.props

    const content = [
      {
        name: 'Edit Profile',
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
        name: 'Groups & Affiliations',
        path: '/settings/groups',
        component: <UserGroupsTab personId={currentUser.id} />
      },
      {
        name: 'Invites & Requests',
        path: '/settings/invitations',
        component: <ManageInvitesTab currentUser={currentUser} />
      },
      {
        name: 'Notifications',
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
        name: 'Account',
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
        name: 'Saved Searches',
        path: '/settings/saved-searches',
        component: <SavedSearchesTab />
      }
    ]

    if (currentUser && !isEmpty(currentUser.blockedUsers.toRefArray())) {
      content.push({
        name: 'Blocked Users',
        path: '/settings/blocked-users',
        component: <BlockedUsersTab
          blockedUsers={blockedUsers}
          unBlockUser={unBlockUser}
          loading={fetchPending} />
      })
    }

    if (currentUser && currentUser.hasFeature(PROJECT_CONTRIBUTIONS)) {
      content.push({
        name: 'Payment',
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
