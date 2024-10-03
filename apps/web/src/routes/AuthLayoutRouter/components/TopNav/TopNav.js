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
import RoundImage from 'components/RoundImage'
import { CONTEXT_MY } from 'store/constants'
import { bgImageStyle } from 'util/index'
import { hyloLogo, publicLogo } from 'util/assets'
import { localeToFlagEmoji, localeLocalStorageSync } from 'util/locale'
import { baseUrl, personUrl } from 'util/navigation'

import styles from './TopNav.module.scss'

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
    <div className={cx(styles.topNavWrapper, className)} onClick={onClick}>
      <div className={cx(styles.topNav, { [styles.groupMenuOpen]: isGroupMenuOpen })} ref={topNav}>
        <div className={styles.drawerToggle} id='toggleDrawer'>
          <button className={styles.drawerToggleButton} onClick={toggleDrawer}><Icon name='Hamburger' className={styles.menuIcon} /></button>
          {showMenuBadge && <Badge number='1' className={styles.logoBadge} border />}
        </div>
        <Link
          to={baseUrl(pick(['context', 'groupSlug'], routeParams))}
          onClick={toggleGroupMenu}
          className={cx(styles.currentContext, { [styles.groupMenuOpen]: isGroupMenuOpen })}
          id='currentContext'
        >
          <Logo {...{ group, isPublic }} />
          <Title group={group} isPublic={isPublic} isMyHome={isMyHome} />
        </Link>
        <div className={styles.navIcons} id='personalSettings'>
          <Dropdown
            className={cx(styles.navMenu, styles.supportMenu)}
            alignLeft
            toggleChildren={
              <Icon name='QuestionMark' />
            }
          >
            <li><span className={styles.hoverHighlight} onClick={showIntercom}>{t('Feedback & Support')}</span></li>
            <li><a href='https://hylozoic.gitbook.io/hylo/guides/hylo-user-guide' target='_blank' rel='noreferrer' className={styles.hoverHighlight}>{t('User Guide')}</a></li>
            <li><a href='http://hylo.com/terms/' target='_blank' rel='noreferrer' className={styles.hoverHighlight}>{t('Terms & Privacy')}</a></li>
            <li><span className={cx(styles.hoverHighlight, styles[appStoreLinkClass])} onClick={downloadApp}>{t('Download App')}</span></li>
            <li><a href='https://opencollective.com/hylo' target='_blank' rel='noreferrer' className={styles.hoverHighlight}>{t('Contribute to Hylo')}</a></li>
          </Dropdown>
          <Link to='/search'><Icon name='Search' className={styles.icon} /></Link>
          <Suspense fallback={<BadgedIcon name='Messages' className={styles.icon} />}>
            <MessagesDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Messages' className={styles.icon} showBadge={showBadge} />} />
          </Suspense>
          <Suspense fallback={<BadgedIcon name='Notifications' className={styles.icon} />}>
            <NotificationsDropdown renderToggleChildren={showBadge =>
              <BadgedIcon name='Notifications' className={styles.icon} showBadge={showBadge} />} />
          </Suspense>
          <Dropdown
            className={cx(styles.navMenu, styles.userMenu)}
            alignRight
            noOverflow
            toggleChildren={
              <RoundImage url={get('avatarUrl', currentUser)} small />
            }
          >
            <li>
              <Link className={styles.hoverHighlight} to={profileUrl}>
                {t('Profile')}
              </Link>
            </li>
            <li><Link className={styles.hoverHighlight} to='/settings'>{t('Settings')}</Link></li>
            <li>
              <Suspense fallback={<span>{t('Locale')} {localeFlag}</span>}>
                <LocaleDropdown className={styles.localeDropdown} renderToggleChildren={<span className={styles.locale}>{t('Locale')} {localeFlag}</span>} />
              </Suspense>
            </li>
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
    <span className={styles.image} style={imageStyle}>
      <span>
        <Icon name='Home' className={styles.homeLink} />
        <Icon name='Ex' className={styles.closeGroupMenu} />
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
    <div className={styles.title}>
      <div className={styles.label}>{label}</div>
      <div className={styles.groupName}>{name}</div>
    </div>
  )
}
