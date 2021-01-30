import React, { Component } from 'react'
import { bgImageStyle } from 'util/index'
import { personUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Icon from 'components/Icon'
import isMobile from 'ismobilejs'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import { IntercomAPI } from 'react-intercom'
import RoundImage from 'components/RoundImage'
import './TopNav.scss'
import Dropdown from 'components/Dropdown'
import { get } from 'lodash/fp'
import { hyloLogo, publicLogo } from 'util/assets'
import MessagesDropdown from './MessagesDropdown'
import NotificationsDropdown from './NotificationsDropdown'

function isMobileDevice () {
  return (
    isMobile.apple.phone ||
    isMobile.apple.ipod ||
    isMobile.android.phone ||
    isMobile.seven_inch
  )
}

function showIntercom () {
  IntercomAPI('show')
}

function downloadApp () {
  if (isMobileDevice()) {
    if (isMobile.apple.device) {
      window.open('https://appsto.re/us/0gcV7.i', '_blank')
    } else if (isMobile.android.device) {
      window.open('https://play.google.com/store/apps/details?id=com.hylo.hyloandroid', '_blank')
    } else {
      return false
    }
  }
}

export default class TopNav extends Component {
  render () {
    const { className, community, network, currentUser, logout, toggleDrawer, showLogoBadge, onClick, isPublic } = this.props
    const profileUrl = personUrl(get('id', currentUser))

    const appStoreLinkClass = isMobileDevice() ? 'isMobileDevice' : 'isntMobileDevice'

    return <div styleName='topNavWrapper' className={className} onClick={onClick}>
      <div styleName='topNav' ref='topNav'>
        <div styleName='logo-hover'>
          <Logo {...{ communityOrNetwork: community || network, isPublic, toggleDrawer }} />
          {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
          <Title community={community} network={network} isPublic={isPublic} onClick={toggleDrawer} />
        </div>
        <div styleName='navIcons'>
          <Link to='/search'><Icon name='Search' styleName='icon' /></Link>
          <MessagesDropdown renderToggleChildren={showBadge =>
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
            <li><span styleName={'hover-highlight'} onClick={showIntercom}>Feedback & Support</span></li>
            <li><Link styleName={'hover-highlight'} to='/terms'>Terms & Privacy</Link></li>
            <li><span styleName={cx('hover-highlight', appStoreLinkClass)} onClick={downloadApp}>Download App</span></li>
            <li><a onClick={logout}>Log out</a></li>
          </Dropdown>
        </div>
      </div>
    </div>
  }
}

function Logo ({ communityOrNetwork, isPublic, toggleDrawer, showLogoBadge }) {
  let imageStyle = bgImageStyle(hyloLogo)
  if (communityOrNetwork) {
    imageStyle = bgImageStyle(get('avatarUrl', communityOrNetwork))
  } else if (isPublic) {
    imageStyle = bgImageStyle(publicLogo)
  }

  return <span styleName='image' style={imageStyle} onClick={toggleDrawer} />
}

function Title ({ community, network, isPublic, onClick }) {
  var [ label, name ] = ['GLOBAL', 'All Communities']
  if (community) {
    [ label, name ] = ['COMMUNITY', community.name]
  } else if (network) {
    [ label, name ] = ['NETWORK', network.name]
  } else if (isPublic) {
    [ label, name ] = ['GLOBAL', 'Public View']
  }

  return <a styleName='title' onClick={onClick}>
    <div styleName='label'>
      {label}
    </div>
    <div styleName='communityName'>{name}</div>
  </a>
}
