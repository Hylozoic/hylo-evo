import React, { PropTypes, Component } from 'react'
import './UserSettings.scss'
import AccountSettings from './AccountSettings/AccountSettings'
import CommunitySettings from './CommunitySettings/CommunitySettings'
import NotificationSettings from './NotificationSettings/NotificationSettings'
import { get } from 'lodash/fp'
const { object, func } = PropTypes
import FullPageModal from 'routes/FullPageModal'

export default class UserSettings extends Component {
  static propTypes = {
    currentUser: object,
    onClose: func
  }

  componentDidMount () {
    this.props.fetchUserSettings()
  }

  componentDidUpdate (prevProps, prevState) {
    if (get('currentUser.id', prevProps) !== get('currentUser.id', this.props)) {
      this.props.fetchUserSettings()
    }
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
      updateMembershipSettings
    } = this.props

    return <FullPageModal
      content={[
        {
          name: 'Account',
          path: '/settings',
          component: <AccountSettings
            currentUser={currentUser}
            updateUserSettings={updateUserSettings}
            loginWithService={loginWithService}
            unlinkAccount={unlinkAccount}
            setConfirm={setConfirm} />
        },
        {
          name: 'Communities',
          path: '/settings/communities',
          component: <CommunitySettings
            memberships={memberships}
            leaveCommunity={leaveCommunity}
            updateMembershipSettings={updateMembershipSettings} />
        },
        {
          name: 'Notifications',
          path: '/settings/notifications',
          component: <NotificationSettings
            currentUser={currentUser}
            updateUserSettings={updateUserSettings} />
        }
      ]} />
  }
}
