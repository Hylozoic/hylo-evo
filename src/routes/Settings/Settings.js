import React, { PropTypes, Component } from 'react'
import styles from './Settings.scss'
import { NavLink, Route } from 'react-router-dom'
import Icon from 'components/Icon'
import AccountSettings from './AccountSettings/AccountSettings'
import CommunitySettings from './CommunitySettings/CommunitySettings'
const { object } = PropTypes

export default class Settings extends Component {
  static propTypes = {
    currentUser: object
  }

  render () {
    const { currentUser, goBack } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <NavLink to='/settings' exact activeClassName={styles.active} styleName='nav-link'>Account</NavLink>
          <NavLink to='/settings/communities' exact activeClassName={styles.active} styleName='nav-link'>Communities</NavLink>
        </div>
        <div styleName='center'>
          <Route path='/settings' exact render={() => <AccountSettings currentUser={currentUser} />} />
          <Route path='/settings/communities' exact render={() => <CommunitySettings currentUser={currentUser} />} />
        </div>
        <div styleName='right-sidebar'>
          <CloseButton onClose={goBack} />
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
