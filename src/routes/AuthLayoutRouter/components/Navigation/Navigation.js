import cx from 'classnames'
import { compact } from 'lodash/fp'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from 'components/Icon'
import { topicsUrl } from 'util/navigation'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import { GROUP_TYPES } from 'store/models/Group'
import './Navigation.scss'
import { CONTEXT_MY } from 'store/constants'

export default function Navigation (props) {
  const {
    badge,
    className,
    clearBadge,
    clearStream,
    createPath,
    collapsed,
    explorePath,
    membersPath,
    projectsPath,
    eventsPath,
    group = {},
    groupId,
    groupsPath,
    hasRelatedGroups,
    hideTopics,
    isGroupMenuOpen,
    mapPath,
    mapView,
    routeParams,
    rootPath,
    streamPath,
    toggleGroupMenu
  } = props

  const homeOnClick = () => {
    if (window.location.pathname === rootPath) {
      clearStream()
      clearBadge()
    }
  }

  const { t } = useTranslation()

  // This should probably be normalized between
  // store/models/Group/PUBLIC_CONTEXT_ID (public-context)
  // and here and in Drawer, etc (public)
  const isPublic = routeParams.context === 'public'
  const isMyContext = routeParams.context === CONTEXT_MY

  const customViews = (group && group.customViews && group.customViews.toRefArray()) || []

  const myLinks = [
    createPath && {
      label: t('Create'),
      icon: 'Create',
      to: createPath
    },
    {
      label: t('My Posts'),
      icon: 'Posticon',
      to: '/my/posts'
    },
    {
      label: t('Interactions'),
      icon: 'Support',
      to: '/my/interactions'
    },
    {
      label: t('Mentions'),
      icon: 'Email',
      to: '/my/mentions'
    },
    {
      label: t('Announcements'),
      icon: 'Announcement',
      to: '/my/announcements'
    }
  ]

  const regularLinks = compact([
    createPath && {
      label: t('Create'),
      icon: 'Create',
      to: createPath
    },
    rootPath && {
      label: group && group.type === GROUP_TYPES.farm ? t('Home') : t('Stream'),
      icon: group && group.type === GROUP_TYPES.farm ? 'Home' : 'Stream',
      to: rootPath,
      badge: badge,
      handleClick: homeOnClick,
      exact: true
    },
    streamPath && group && group.type === GROUP_TYPES.farm && {
      label: t('Stream'),
      icon: 'Stream',
      to: streamPath
    },
    explorePath && group && group.type !== GROUP_TYPES.farm && {
      label: t('Explore'),
      icon: 'Binoculars',
      to: explorePath
    },
    projectsPath && {
      label: t('Projects'),
      icon: 'Projects',
      to: projectsPath
    },
    eventsPath && {
      label: t('Events'),
      icon: 'Events',
      to: eventsPath
    },
    membersPath && {
      label: t('Members'),
      icon: 'People',
      to: membersPath
    },
    (hasRelatedGroups || isPublic) && groupsPath && {
      label: isPublic ? t('Group Explorer') : t('Groups'),
      icon: 'Groups',
      to: groupsPath
    },
    mapPath && {
      label: t('Map'),
      icon: 'Globe',
      to: mapPath
    },
    ...customViews.filter(cv => cv.name && (cv.type !== 'externalLink' || cv.externalLink)).map(cv => ({
      label: cv.name,
      icon: cv.icon,
      to: cv.type !== 'externalLink' ? `${rootPath}/custom/${cv.id}` : false,
      externalLink: cv.type === 'externalLink' ? cv.externalLink : false
    }))
  ])

  const collapserState = collapsed ? 'collapser-collapsed' : 'collapser'
  const canView = !group || group.memberCount !== 0
  const links = isMyContext ? myLinks : regularLinks

  return (
    <div styleName={cx({ mapView }, collapserState, { showGroupMenu: isGroupMenuOpen })} className={className}>
      <div styleName='navigation'>
        {canView && (
          <ul styleName='links' id='groupMenu'>
            {links.map((link, i) => (
              <NavLink
                key={link.label + i}
                externalLink={link.externalLink}
                {...link}
                collapsed={collapsed}
                onClick={link.handleClick}
              />)
            )}
            <li styleName={cx('item', 'topicItem')}>
              <Link to={topicsUrl(routeParams)}>
                <Icon name='Topics' />
              </Link>
            </li>
          </ul>
        )}
        {!hideTopics && canView && !isMyContext && (
          <TopicNavigation
            collapsed={collapsed}
            backUrl={rootPath}
            routeParams={routeParams}
            groupId={groupId}
          />
        )}
      </div>
      <div styleName='closeBg' onClick={toggleGroupMenu} />
    </div>
  )
}
