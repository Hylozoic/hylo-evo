import React from 'react'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import { bgImageStyle } from 'util/index'
import { personUrl, messagesUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import { isSmallScreen } from 'util/responsive'
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
  goBack
}) {
  const profileUrl = personUrl(get('id', currentUser))
  const smallScreen = isSmallScreen()

  return <div styleName='topNavWrapper' className={className}>
    <div styleName='topNav'>
      {goBack && <Button styleName='backButton' color='gray' small narrow onClick={goBack}>
        <Logo {...{ communityOrNetwork: community || network, toggleDrawer }} />
        <Title label='< Back to' community={community} network={network} />
      </Button>}
      {!goBack && <div styleName='logo-hover' onClick={onClick}>
        <Logo {...{ communityOrNetwork: community || network, toggleDrawer }} />
        {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
        <Title community={community} network={network} onClick={toggleDrawer} />
      </div>}
      <div styleName='navIcons'>
        {!HOLOCHAIN_ACTIVE && <Link to='/search'><Icon name='Search' styleName='icon' /></Link>}
        {smallScreen && <Link to={messagesUrl()}><Icon name='Messages' styleName='icon' /></Link>}
        {!smallScreen && <MessagesDropdown
          renderToggleChildren={showBadge =>
            <BadgedIcon name='Messages' styleName='icon' showBadge={showBadge} />}
          openLastThread={!smallScreen} />}
        {!HOLOCHAIN_ACTIVE && <NotificationsDropdown renderToggleChildren={showBadge =>
          <BadgedIcon name='Notifications' styleName='icon' showBadge={showBadge} />} />}
        <Dropdown styleName='user-menu' alignRight toggleChildren={
          <RoundImage url={get('avatarUrl', currentUser)} small={!smallScreen} medium={smallScreen} />}>
          {!HOLOCHAIN_ACTIVE && <>
            <li>
              <Link styleName={'hover-highlight'} to={profileUrl}>
                Profile
              </Link>
            </li>
            <li><Link styleName={'hover-highlight'} to='/settings'>Settings</Link></li>
            <li><a onClick={logout}>Log out</a></li>
          </>}
        </Dropdown>
      </div>
    </div>
  </div>
}

function Logo ({ communityOrNetwork, toggleDrawer }) {
  const imageStyle = bgImageStyle(get('avatarUrl', communityOrNetwork) || hyloLogo)
  return <span styleName='image' style={imageStyle} onClick={toggleDrawer} />
}

function Title ({ community, network, onClick, label }) {
  var [ labelText, name ] = ['GLOBAL', 'All Communities']
  if (community) {
    [ labelText, name ] = ['COMMUNITY', community.name]
  } else if (network) {
    [ labelText, name ] = ['NETWORK', network.name]
  }
  if (label) {
    labelText = label
  }

  return <a styleName='title' onClick={onClick}>
    <div styleName='label'>
      {labelText}
    </div>
    <div styleName='communityName'>{name}</div>
  </a>
}
