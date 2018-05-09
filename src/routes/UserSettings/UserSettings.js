import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './UserSettings.scss'
import AccountSettingsTab from './AccountSettingsTab/AccountSettingsTab'
import CommunitySettingsTab from './CommunitySettingsTab/CommunitySettingsTab'
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
      updateUserSettings,
      leaveCommunity,
      loginWithService,
      unlinkAccount,
      setConfirm,
      updateMembershipSettings,
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
            leaveCommunity={leaveCommunity}
            updateMembershipSettings={updateMembershipSettings} />
        },
        {
          name: 'Notifications',
          path: '/settings/notifications',
          component: <NotificationSettingsTab
            currentUser={currentUser}
            updateUserSettings={updateUserSettings}
            memberships={memberships}
            updateMembershipSettings={updateMembershipSettings} />
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
