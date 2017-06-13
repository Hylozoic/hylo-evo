import React, { PropTypes, Component } from 'react'
import './UserSettings.scss'
import AccountSettings from './AccountSettings/AccountSettings'
import CommunitySettings from './CommunitySettings/CommunitySettings'
import NotificationSettings from './NotificationSettings/NotificationSettings'
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
    if (prevProps.currentUser !== this.props.currentUser) {
      this.props.fetchUserSettings()
    }
  }

  render () {
    const {
      currentUser,
      communities,
      updateUserSettings,
      leaveCommunity,
      loginWithService,
      unlinkAccount,
      setConfirm
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
            communities={communities}
            leaveCommunity={leaveCommunity} />
        },
        {
          name: 'Notifications',
          path: '/settings/notifications',
          component: <NotificationSettings
            currentUser={currentUser}
            updateUserSettings={changes => console.log('updateUserSettings', changes)}/>
        }
      ]} />
  }
}
