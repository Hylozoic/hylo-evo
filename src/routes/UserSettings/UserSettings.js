import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { hasFeature } from 'store/models/Me'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import AccountSettingsTab from './AccountSettingsTab/AccountSettingsTab'
import CommunitySettingsTab from './CommunitySettingsTab/CommunitySettingsTab'
import BlockedUsersTab from './BlockedUsersTab/BlockedUsersTab'
import NotificationSettingsTab from './NotificationSettingsTab/NotificationSettingsTab'
import PasswordSettingsTab from './PasswordSettingsTab/PasswordSettingsTab'
import PaymentSettingsTab from './PaymentSettingsTab/PaymentSettingsTab'
import FullPageModal from 'routes/FullPageModal'
import './UserSettings.scss'

const { object, func } = PropTypes

export default class UserSettings extends Component {
  static propTypes = {
    currentUser: object,
    onClose: func
  }

  // componentDidMount () {
  //   this.props.fetchForCurrentUser()
  // }

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
      registerStripeAccount
    } = this.props

    console.log('!!!!!! rerendering with new props currentUser:', updateUserSettings)

    const content = [
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
        path: '/settings/blocked-users',
        component: <BlockedUsersTab
          blockedUsers={blockedUsers}
          unBlockUser={unBlockUser}
          loading={fetchPending} />
      },
      {
        name: 'Password',
        path: '/settings/password',
        component: <PasswordSettingsTab
          currentUser={currentUser}
          updateUserSettings={updateUserSettings}
          setConfirm={setConfirm} />
      }
    ]

    if (currentUser && hasFeature(currentUser, PROJECT_CONTRIBUTIONS)) {
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
