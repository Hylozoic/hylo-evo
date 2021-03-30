import cx from 'classnames'
import { compact } from 'lodash/fp'
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { topicsUrl } from 'util/navigation'
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
    eventsPath,
    groupId,
    groupsPath,
    hasRelatedGroups,
    hideTopics,
    mapPath,
    mapView,
    membersPath,
    projectsPath,
    routeParams,
    rootPath
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
      label: 'Home',
      icon: 'Home',
      to: rootPath,
      badge: badge,
      onClick: homeOnClick,
      exact: true
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
      icon: 'Members',
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

  return <div styleName={cx({ mapView }, collapserState)} className={className}>
    <div styleName='navigation'>
      <ul styleName='links' id='groupMenu'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed}
            onClick={link.onClick} />)}
        <li styleName={cx('item', 'topicItem')}>
          <Link to={topicsUrl({ routeParams })}>
            <Icon name='Topics' />
          </Link>
        </li>
      </ul>
      {!hideTopics && <TopicNavigation
        collapsed={collapsed}
        backUrl={rootPath}
        routeParams={routeParams}
        groupId={groupId} />}
    </div>
  </div>
}
