import React, { Component } from 'react'
import { bgImageStyle } from 'util/index'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Icon from 'components/Icon'
import isMobile from 'ismobilejs'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import { IntercomAPI } from 'react-intercom'
import RoundImage from 'components/RoundImage'
import { personUrl, baseUrl } from 'util/navigation'
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
    const { className, group, currentUser, logout, toggleDrawer, toggleGroupMenu, showLogoBadge, onClick, isPublic, isGroupMenuOpen } = this.props

    const profileUrl = personUrl(get('id', currentUser))

    const appStoreLinkClass = isMobileDevice() ? 'isMobileDevice' : 'isntMobileDevice'

    return <div styleName='topNavWrapper' className={className} onClick={onClick}>
      <div styleName={cx('topNav', { groupMenuOpen: isGroupMenuOpen })} ref='topNav'>
        <div styleName='drawerToggle'>
          <button styleName='drawerToggleButton' onClick={toggleDrawer}><Icon name='Hamburger' styleName='menuIcon' /></button>
        </div>
        <Link to='/' styleName='logo-hover'>
          <Logo {...{ group, isPublic }} />
          {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
          <Title group={group} isPublic={isPublic} />
        </Link>
        <div onClick={toggleGroupMenu} styleName={cx('mobile-logo', { groupMenuOpen: isGroupMenuOpen })}>
          <Logo {...{ group, isPublic }} />
          {showLogoBadge && <Badge number='1' styleName='logoBadge' border />}
          <Title group={group} isPublic={isPublic} />
        </div>
        <div styleName='navIcons' id='personalSettings'>
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
            <li><span styleName={'hover-highlight'} onClick={showIntercom}>Feedback &amp; Support</span></li>
            <li><a href='http://hylo.com/terms' target='_blank' styleName={'hover-highlight'}>Terms & Privacy</a></li>
            <li><span styleName={cx('hover-highlight', appStoreLinkClass)} onClick={downloadApp}>Download App</span></li>
            <li><a onClick={logout}>Log out</a></li>
          </Dropdown>
        </div>
      </div>
    </div>
  }
}

function Logo ({ group, isPublic, showLogoBadge }) {
  let imageStyle = bgImageStyle(hyloLogo)
  if (group) {
    imageStyle = bgImageStyle(get('avatarUrl', group))
  } else if (isPublic) {
    imageStyle = bgImageStyle(publicLogo)
  }

  return <span styleName='image' style={imageStyle}>
    <span>
      <Icon name='Home' styleName='homeLink' />
      <Icon name='Ex' styleName='closeGroupMenu' />
    </span>
  </span>
}

function Title ({ group, isPublic, onClick }) {
  var [ label, name ] = ['GLOBAL', 'All My Groups']
  if (group) {
    [ label, name ] = ['GROUP', group.name]
  } else if (isPublic) {
    [ label, name ] = ['GLOBAL', 'Public Groups & Posts']
  }

  return <div styleName='title' id='currentContext'>
    <div styleName='label'>{label}</div>
    <div styleName='groupName'>{name}</div>
  </div>
}
