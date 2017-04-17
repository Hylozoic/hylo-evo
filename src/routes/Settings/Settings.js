import React, { PropTypes, Component } from 'react'
import './Settings.scss'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { bgImageStyle } from 'util/index'
const { object } = PropTypes

export default class Settings extends Component {
  static propTypes = {
    currentUser: object
  }

  render () {
    const { currentUser } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <Link to='/settings' styleName='nav-link nav-link--active'>Account</Link>
          <Link to='/settings/communities'styleName='nav-link'>Communities</Link>
        </div>
        <SettingsControls currentUser={currentUser} />
        <div styleName='right-sidebar'>
          <CloseButton onClose={() => console.log('closed')} />
        </div>
      </div>
    </div>
  }
}

export function SettingsControls ({ currentUser }) {
  const { name, avatarUrl, bannerUrl } = currentUser
  return <div styleName='center'>
    <div styleName='name'>{name}</div>
    <div style={bgImageStyle(bannerUrl)} styleName='banner' />
    <div style={bgImageStyle(avatarUrl)} styleName='avatar' />
  </div>
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
