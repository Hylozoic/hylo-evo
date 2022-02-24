import cx from 'classnames'
import { get, pick } from 'lodash/fp'
import React, { Component, Suspense } from 'react'
import { IntercomAPI } from 'react-intercom'
import { Link } from 'react-router-dom'
import { isMobileDevice, downloadApp } from 'util/mobile'
import Badge from 'components/Badge'
import BadgedIcon from 'components/BadgedIcon'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'
import { hyloLogo, publicLogo } from 'util/assets'
import { baseUrl, personUrl } from 'util/navigation'
import './TopNav.scss'

const MessagesDropdown = React.lazy(() => import('./MessagesDropdown'))
const NotificationsDropdown = React.lazy(() => import('./NotificationsDropdown'))

function showIntercom () {
  IntercomAPI('show')
}

export default class TopNav extends Component {
  render () {
    const {
      className,
      currentUser,
      group,
      isGroupMenuOpen,
      isPublic,
      logout,
      onClick,
      routeParams,
      showMenuBadge,
      toggleDrawer,
      toggleGroupMenu
    } = this.props
    const profileUrl = personUrl(get('id', currentUser))

    const appStoreLinkClass = isMobileDevice() ? 'isMobileDevice' : 'isntMobileDevice'

    return <div styleName='topNavWrapper' className={className} onClick={onClick}>
      <div styleName={cx('topNav', { groupMenuOpen: isGroupMenuOpen })} ref='topNav'>
        <div styleName='drawerToggle' id='toggleDrawer'>
          <button styleName='drawerToggleButton' onClick={toggleDrawer}><Icon name='Hamburger' styleName='menuIcon' /></button>
          {showMenuBadge && <Badge number='1' styleName='logoBadge' border />}
        </div>
        <Link
          to={baseUrl(pick(['context', 'groupSlug'], routeParams))}
          onClick={toggleGroupMenu}
          styleName={cx('current-context', { groupMenuOpen: isGroupMenuOpen })}
          id='currentContext'
        >
          <Logo {...{ group, isPublic }} />
          <Title group={group} isPublic={isPublic} />
        </Link>
        <div styleName='navIcons' id='personalSettings'>
          <Link to='/search'><Icon name='Search' styleName='icon' /></Link>
          <Suspense fallback={<BadgedIcon name='Messages' styleName='icon' />}>
            <MessagesDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Messages' styleName='icon'
                showBadge={showBadge} />} />
          </Suspense>
          <Suspense fallback={<BadgedIcon name='Notifications' styleName='icon' />}>
            <NotificationsDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Notifications' styleName='icon'
                showBadge={showBadge} />} />
          </Suspense>
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
            <li><a href='http://hylo.com/terms/' target='_blank' styleName={'hover-highlight'}>Terms & Privacy</a></li>
            <li><span styleName={cx('hover-highlight', appStoreLinkClass)} onClick={downloadApp}>Download App</span></li>
            <li><a onClick={logout}>Log out</a></li>
          </Dropdown>
        </div>
      </div>
    </div>
  }
}

function Logo ({ group, isPublic }) {
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

  return <div styleName='title'>
    <div styleName='label'>{label}</div>
    <div styleName='groupName'>{name}</div>
  </div>
}
