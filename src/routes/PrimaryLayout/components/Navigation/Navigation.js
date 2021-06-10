import cx from 'classnames'
import { compact } from 'lodash/fp'
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { topicsUrl, allGroupsUrl } from 'util/navigation'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'

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
    group,
    groupId,
    groupsPath,
    hasRelatedGroups,
    hideTopics,
    isGroupMenuOpen,
    mapPath,
    mapView,
    routeParams,
    rootPath,
    toggleGroupMenu
  } = props

  const homeOnClick = () => {
    if (window.location.pathname === rootPath) {
      clearFeedList()
      clearBadge()
    }
  }

  const links = compact([
    createPath && {
      label: 'Create',
      icon: 'Create',
      to: createPath
    },
    rootPath && {
      label: 'Stream',
      icon: 'Stream',
      to: rootPath,
      badge: badge,
      onClick: homeOnClick,
      exact: true,
      home: true
    },
    explorePath && {
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
    hasRelatedGroups && groupsPath && {
      label: 'Groups',
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

  return <div styleName={cx({ mapView }, collapserState, { showGroupMenu: isGroupMenuOpen })} className={className}>
    <div styleName='navigation'>
      {canView &&
        <ul styleName='links' id='groupMenu'>
          {links.map(link =>
            <NavLink key={link.label} {...link} collapsed={collapsed}
              onClick={link.onClick} />)}
          <li styleName={cx('item', 'topicItem')}>
            <Link to={topicsUrl(routeParams, allGroupsUrl())}>
              <Icon name='Topics' />
            </Link>
          </li>
        </ul>
      }
      {!hideTopics && canView && <TopicNavigation
        collapsed={collapsed}
        backUrl={rootPath}
        routeParams={routeParams}
        groupId={groupId} />}
    </div>
    <div styleName='closeBg' onClick={toggleGroupMenu} />
  </div>
}
