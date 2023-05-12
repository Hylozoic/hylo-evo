import cx from 'classnames'
import { get, pick } from 'lodash/fp'
import React, { Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import { Link } from 'react-router-dom'
import { isMobileDevice, downloadApp } from 'util/mobile'
import Badge from 'components/Badge'
import BadgedIcon from 'components/BadgedIcon'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { localeToFlagEmoji, localeLocalStorageSync } from 'util/locale'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'
import { hyloLogo, publicLogo } from 'util/assets'
import { baseUrl, personUrl } from 'util/navigation'
import './TopNav.scss'
import { CONTEXT_MY } from 'store/constants'

const MessagesDropdown = React.lazy(() => import('./MessagesDropdown'))
const NotificationsDropdown = React.lazy(() => import('./NotificationsDropdown'))
const LocaleDropdown = React.lazy(() => import('./LocaleDropdown'))

export default function TopNav (props) {
  const {
    className,
    currentUser,
    group,
    isGroupMenuOpen,
    logout,
    onClick,
    routeParams,
    showMenuBadge,
    toggleDrawer,
    toggleGroupMenu
  } = props
  const topNav = useRef()
  const { show: showIntercom } = useIntercom()
  const profileUrl = personUrl(get('id', currentUser))
  const isPublic = routeParams.context === 'public'
  const isMyHome = routeParams.context === CONTEXT_MY
  const locale = currentUser?.settings?.locale
  const localeFlag = localeToFlagEmoji(localeLocalStorageSync(locale))

  const appStoreLinkClass = isMobileDevice() ? 'isMobileDevice' : 'isntMobileDevice'
  const { t } = useTranslation()

  return (
    <div styleName='topNavWrapper' className={className} onClick={onClick}>
      <div styleName={cx('topNav', { groupMenuOpen: isGroupMenuOpen })} ref={topNav}>
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
          <Title group={group} isPublic={isPublic} isMyHome={isMyHome} />
        </Link>
        <div styleName='navIcons' id='personalSettings'>
          <Suspense fallback={<span>{localeFlag}</span>}>
            <LocaleDropdown renderToggleChildren={<span styleName='locale'>{localeFlag}</span>} />
          </Suspense>
          <Link to='/search'><Icon name='Search' styleName='icon' /></Link>
          <Suspense fallback={<BadgedIcon name='Messages' styleName='icon' />}>
            <MessagesDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Messages' styleName='icon' showBadge={showBadge} />} />
          </Suspense>
          <Suspense fallback={<BadgedIcon name='Notifications' styleName='icon' />}>
            <NotificationsDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Notifications' styleName='icon' showBadge={showBadge} />} />
          </Suspense>
          <Dropdown
            styleName='user-menu'
            alignRight
            toggleChildren={
              <RoundImage url={get('avatarUrl', currentUser)} small />
            }
          >
            <li>
              <Link styleName='hover-highlight' to={profileUrl}>
                {t('Profile')}
              </Link>
            </li>
            <li><Link styleName='hover-highlight' to='/settings'>{t('Settings')}</Link></li>
            <li><span styleName='hover-highlight' onClick={showIntercom}>{t('Feedback & Support')}</span></li>
            <li><a href='http://hylo.com/terms/' target='_blank' rel='noreferrer' styleName='hover-highlight'>{t('Terms & Privacy')}</a></li>
            <li><span styleName={cx('hover-highlight', appStoreLinkClass)} onClick={downloadApp}>{t('Download App')}</span></li>
            <li><a href='https://opencollective.com/hylo' target='_blank' rel='noreferrer' styleName='hover-highlight'>{t('Contribute to Hylo')}</a></li>
            <li><a onClick={logout}>{t('Log out')}</a></li>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

function Logo ({ group, isPublic }) {
  let imageStyle = bgImageStyle(hyloLogo)
  if (group) {
    imageStyle = bgImageStyle(get('avatarUrl', group))
  } else if (isPublic) {
    imageStyle = bgImageStyle(publicLogo)
  }

  return (
    <span styleName='image' style={imageStyle}>
      <span>
        <Icon name='Home' styleName='homeLink' />
        <Icon name='Ex' styleName='closeGroupMenu' />
      </span>
    </span>
  )
}

function Title ({ group, isPublic, onClick, isMyHome }) {
  const { t } = useTranslation()
  let [label, name] = [t('PERSONAL'), t('All My Groups')]
  if (group) {
    [label, name] = [group.typeDescriptor, group.name]
  } else if (isPublic) {
    [label, name] = [t('GLOBAL'), t('Public Groups & Posts')]
  } else if (isMyHome) {
    [label, name] = [t('PERSONAL'), t('My Home')]
  }

  return (
    <div styleName='title'>
      <div styleName='label'>{label}</div>
      <div styleName='groupName'>{name}</div>
    </div>
  )
}
