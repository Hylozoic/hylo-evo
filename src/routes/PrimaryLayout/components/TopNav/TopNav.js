import React from 'react'
import { bgImageStyle } from 'util/index'
import { personUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import RoundImage from 'components/RoundImage'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { hyloLogo } from 'util/assets'
import MessagesDropdown from './MessagesDropdown'
import NotificationsDropdown from './NotificationsDropdown'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import './TopNav.scss'

export default function TopNav ({
  className,
  community,
  network,
  currentUser,
  logout,
  toggleDrawer,
  showLogoBadge,
  onClick,
  goBack,
  smallScreen
}) {
  const profileUrl = personUrl(get('id', currentUser))

  return <div styleName='topNavWrapper' className={className}>
    <div styleName='topNav'>
      {goBack && <BackButton onClick={goBack} />}
      <div styleName='logo-hover' onClick={onClick}>
        <Logo {...{ communityOrNetwork: community || network, toggleDrawer }} />
        {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
        <Title community={community} network={network} onClick={toggleDrawer} />
      </div>
      <div styleName='navIcons'>
        {!HOLOCHAIN_ACTIVE && <Link to='/search'><Icon name='Search' styleName='icon' /></Link>}
        <MessagesDropdown renderToggleChildren={showBadge =>
          <BadgedIcon name='Messages' styleName='icon'
            showBadge={showBadge} />} />
        <NotificationsDropdown renderToggleChildren={showBadge =>
          <BadgedIcon name='Notifications' styleName='icon' showBadge={showBadge} />} />
        <Dropdown styleName='user-menu' alignRight toggleChildren={
          <RoundImage url={get('avatarUrl', currentUser)} small={!smallScreen} medium={smallScreen} />
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

function BackButton ({ onClick })  {
  return <Button styleName='backButton' color='gray' small narrow onClick={onClick}>&lt; Back</Button>
}

function Logo ({ communityOrNetwork, toggleDrawer }) {
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
