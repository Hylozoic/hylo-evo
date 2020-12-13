import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { isEmpty } from 'lodash/fp'
import EditProfileTab from './EditProfileTab/EditProfileTab'
import CommunitySettingsTab from './CommunitySettingsTab/CommunitySettingsTab'
import BlockedUsersTab from './BlockedUsersTab/BlockedUsersTab'
import NotificationSettingsTab from './NotificationSettingsTab/NotificationSettingsTab'
import AccountSettingsTab from './AccountSettingsTab/AccountSettingsTab'
import PaymentSettingsTab from './PaymentSettingsTab/PaymentSettingsTab'
import SavedSearchesTab from './SavedSearchesTab/SavedSearchesTab'
import FullPageModal from 'routes/FullPageModal'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import './UserSettings.scss'

const { object, func } = PropTypes

export default class UserSettings extends Component {
  static propTypes = {
    currentUser: object,
    onClose: func
  }

  componentDidMount () {
    const { currentUser } = this.props
    this.props.fetchForCurrentUser()
    this.props.fetchSavedSearches(currentUser.id)
  }

  render () {
    const {
      currentUser,
      memberships,
      blockedUsers,
      unBlockUser,
      updateUserSettings,
      leaveCommunity,
      loginWithService,
      unlinkAccount,
      setConfirm,
      updateMembershipSettings,
      updateAllMemberships,
      messageSettings,
      allCommunitiesSettings,
      fetchPending,
      queryParams,
      registerStripeAccount,
      searches,
      deleteSearch,
      viewSavedSearch,
      affiliations,
      createAffiliation,
      deleteAffiliation
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
          fetchPending={fetchPending} />
      },
      {
        name: 'Affiliations',
        path: '/settings/communities',
        component: <CommunitySettingsTab
          affiliations={affiliations}
          createAffiliation={createAffiliation}
          deleteAffiliation={deleteAffiliation}
          memberships={memberships}
          leaveCommunity={leaveCommunity} />
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
          allCommunitiesSettings={allCommunitiesSettings} />
      },
      {
        name: 'Account',
        path: '/settings/account',
        component: <AccountSettingsTab
          currentUser={currentUser}
          updateUserSettings={updateUserSettings}
          setConfirm={setConfirm} />
      },
      {
        name: 'Saved Searches',
        path: '/settings/saved-searches',
        component: <SavedSearchesTab
          searches={searches}
          deleteSearch={deleteSearch}
          viewSavedSearch={viewSavedSearch} />
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

    return <FullPageModal
      content={content} />
  }
}
