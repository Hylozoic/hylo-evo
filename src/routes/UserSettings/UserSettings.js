import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './UserSettings.scss'
import AccountSettingsTab from './AccountSettingsTab/AccountSettingsTab'
import CommunitySettingsTab from './CommunitySettingsTab/CommunitySettingsTab'
import BlockedUsersTab from './BlockedUsersTab/BlockedUsersTab'
import NotificationSettingsTab from './NotificationSettingsTab/NotificationSettingsTab'
import PasswordSettingsTab from './PasswordSettingsTab/PasswordSettingsTab'
import FullPageModal from 'routes/FullPageModal'

const { object, func } = PropTypes

export default class UserSettings extends Component {
  static propTypes = {
    currentUser: object,
    onClose: func
  }

  componentDidMount () {
    this.props.fetchUserSettings()
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
      fetchPending
    } = this.props

    return <FullPageModal
      content={[
        {
          name: 'Account',
          path: '/settings',
          component: <AccountSettingsTab
            currentUser={currentUser}
            updateUserSettings={updateUserSettings}
            loginWithService={loginWithService}
            unlinkAccount={unlinkAccount}
            setConfirm={setConfirm}
            fetchPending={fetchPending} />
        },
        {
          name: 'Communities',
          path: '/settings/communities',
          component: <CommunitySettingsTab
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
          name: 'Blocked Users',
          path: '/settings/block-users',
          component: <BlockedUsersTab
            blockedUsers={blockedUsers}
            unBlockUser={unBlockUser} />
        },
        {
          name: 'Password',
          path: '/settings/password',
          component: <PasswordSettingsTab
            currentUser={currentUser}
            updateUserSettings={updateUserSettings}
            setConfirm={setConfirm} />
        }
      ]} />
  }
}
