import React, { PropTypes, Component } from 'react'
import './UserSettings.scss'
import AccountSettings from './AccountSettings/AccountSettings'
import CommunitySettings from './CommunitySettings/CommunitySettings'
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
      unlinkAccount
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
            />
        },
        {
          name: 'Communities',
          path: '/settings/communities',
          component: <CommunitySettings
            communities={communities}
            leaveCommunity={leaveCommunity} />
        }
      ]} />
  }
}
