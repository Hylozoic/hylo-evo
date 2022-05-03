import cx from 'classnames'
import { compact } from 'lodash/fp'
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { topicsUrl } from 'util/navigation'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import { TYPE_FARM } from 'util/constants'
import './Navigation.scss'

export default function Navigation (props) {
  const {
    badge,
    className,
    clearBadge,
    clearFeedList,
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
      clearFeedList()
      clearBadge()
    }
  }

  // This should probably be normalized between
  // store/models/Group/PUBLIC_CONTEXT_ID (public-context)
  // and here and in Drawer, etc (public)
  const isPublic = routeParams.context === 'public'

  const links = compact([
    createPath && {
      label: 'Create',
      icon: 'Create',
      to: createPath
    },
    rootPath && {
      label: group.type === TYPE_FARM ? 'Home' : 'Stream',
      icon: group.type === TYPE_FARM ? 'Home' : 'Stream',
      to: rootPath,
      badge: badge,
      handleClick: homeOnClick,
      exact: true
    },
    streamPath && group.type === TYPE_FARM && {
      label: 'Stream',
      icon: 'Stream',
      to: streamPath
    },
    explorePath && group.type !== TYPE_FARM && {
      label: 'Explore',
      icon: 'Binoculars',
      to: explorePath
    },
    projectsPath && {
      label: 'Projects',
      icon: 'Projects',
      to: projectsPath
    },
    eventsPath && {
      label: 'Events',
      icon: 'Events',
      to: eventsPath
    },
    membersPath && {
      label: 'Members',
      icon: 'People',
      to: membersPath
    },
    (hasRelatedGroups || isPublic) && groupsPath && {
      label: isPublic ? 'Group Explorer' : 'Groups',
      icon: 'Groups',
      to: groupsPath
    },
    mapPath && {
      label: 'Map',
      icon: 'Globe',
      to: mapPath
    }
  ])

  const collapserState = collapsed ? 'collapser-collapsed' : 'collapser'
  const canView = !group || group.memberCount !== 0

  return (
    <div styleName={cx({ mapView }, collapserState, { showGroupMenu: isGroupMenuOpen })} className={className}>
      <div styleName='navigation'>
        {canView && (
          <ul styleName='links' id='groupMenu'>
            {links.map(link => (
              <NavLink
                key={link.label}
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
        {!hideTopics && canView && (
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
