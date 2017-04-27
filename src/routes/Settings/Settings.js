import React, { PropTypes, Component } from 'react'
import styles from './Settings.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import AccountSettings from './AccountSettings/AccountSettings'
import CommunitySettings from './CommunitySettings/CommunitySettings'
const { object, func } = PropTypes

export default class Settings extends Component {
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
      history,
      goBack,
      push
    } = this.props

    const onClose = history.length > 2
      ? () => goBack()
      : () => push('/')

    return <div styleName='modal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <NavLink to='/settings' exact replace activeClassName={styles.active} styleName='nav-link'>Account</NavLink>
          <NavLink to='/settings/communities' exact replace activeClassName={styles.active} styleName='nav-link'>Communities</NavLink>
        </div>
        <div styleName='center'>
          <Route path='/settings' exact render={() =>
            <AccountSettings
              currentUser={currentUser}
              updateUserSettings={updateUserSettings}
              loginWithService={loginWithService} />} />
          <Route path='/settings/communities' exact render={() =>
            <CommunitySettings communities={communities} leaveCommunity={leaveCommunity} />} />
        </div>
        <div styleName='right-sidebar'>
          <CloseButton onClose={onClose} />
        </div>
      </div>
    </div>
  }
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
