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
    className,
    createPath,
    collapsed,
    group,
    location,
    routeParams,
    rootPath,
    streamPath,
    membersPath,
    projectsPath,
    groupId,
    groupsPath,
    eventsPath,
    mapPath,
    mapView,
    badge,
    clearBadge,
    clearFeedList,
    hideTopics
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
    streamPath && {
      label: 'Stream',
      icon: 'Stream',
      to: streamPath,
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
      label: 'People',
      icon: 'People',
      to: membersPath
    },
    // TODO: hide if no groups
    groupsPath && {
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

  return <div styleName={cx({ mapView }, collapserState)}
    className={className}>
    <div styleName='navigation'>
      {canView &&
        <ul styleName='links'>
          {links.map(link =>
            <NavLink key={link.label} {...link} collapsed={collapsed}
              onClick={link.onClick} />)}
          <li styleName={cx('item', 'topicItem')}>
            <Link to={topicsUrl({ routeParams })}>
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
  </div>
}
