import React, { Component } from 'react'
import { bgImageStyle } from 'util/index'
import { personUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { hyloLogo } from 'util/assets'
import MessagesDropdown from './MessagesDropdown'
import NotificationsDropdown from './NotificationsDropdown'

export default class TopNav extends Component {
  render () {
    const { className, community, network, currentUser, logout, toggleDrawer, showLogoBadge, onClick, holochainActive } = this.props
    const profileUrl = personUrl(get('id', currentUser))

    return <div styleName='topNavWrapper' className={className} onClick={onClick}>
      <div styleName='topNav' ref='topNav'>
        <div styleName='logo-hover'>
          <Logo {...{ communityOrNetwork: community || network, toggleDrawer }} />
          {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
          <Title community={community} network={network} onClick={toggleDrawer} />
        </div>
        <div styleName='navIcons'>
          <Link to='/search'><Icon name='Search' styleName='icon' /></Link>
          <MessagesDropdown holochainActive={holochainActive} renderToggleChildren={showBadge =>
            <BadgedIcon name='Messages' styleName='icon'
              showBadge={showBadge} />} />
          <NotificationsDropdown renderToggleChildren={showBadge =>
            <BadgedIcon name='Notifications' styleName='icon'
              showBadge={showBadge} />} />
          <Dropdown styleName='user-menu' alignRight
            toggleChildren={
              <RoundImage url={get('avatarUrl', currentUser)} small />
            }>
            <li>
              <Link styleName={'hover-highlight'} to={profileUrl}>
                Profile
              </Link>
            </li>
            <li><Link styleName={'hover-highlight'} to='/settings'>Settings</Link></li>
            <li><a onClick={logout}>Log out</a></li>
          </Dropdown>
        </div>
      </div>
    </div>
  }
}

function Logo ({ communityOrNetwork, toggleDrawer, showLogoBadge }) {
  const imageStyle = bgImageStyle(get('avatarUrl', communityOrNetwork) || hyloLogo)
  return <span styleName='image' style={imageStyle} onClick={toggleDrawer} />
}

function Title ({ community, network, onClick }) {
  var [ label, name ] = ['GLOBAL', 'All Communities']
  if (community) {
    [ label, name ] = ['COMMUNITY', community.name]
  } else if (network) {
    [ label, name ] = ['NETWORK', network.name]
  }

  return <a styleName='title' onClick={onClick}>
    <div styleName='label'>
      {label}
    </div>
    <div styleName='communityName'>{name}</div>
  </a>
}
