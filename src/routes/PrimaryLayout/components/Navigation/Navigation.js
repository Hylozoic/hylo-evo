import React from 'react'
import { compact } from 'lodash/fp'
import { EVENTS } from 'config/featureFlags'
import NavLink from './NavLink'
import Icon from 'components/Icon'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import './Navigation.scss'
import { topicsUrl } from 'util/navigation'
import TopicNavigation from './TopicNavigation'
import { compact } from 'lodash/fp'
import { EVENTS } from 'config/featureFlags'

export default function Navigation (props) {
  const {
    currentUser,
    className,
    collapsed,
    routeParams,
    communitySlug,
    rootId,
    rootSlug,
    rootPath,
    membersPath,
    projectsPath,
    communityId,
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

  const hasEventsFeature = currentUser && currentUser.hasFeature(EVENTS)

  const links = compact([
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
    eventsPath && hasEventsFeature && {
      label: 'Events',
      icon: 'Events',
      to: eventsPath
    },
    membersPath && {
      label: 'Members',
      icon: 'Members',
      to: membersPath
    },
    mapPath && {
      label: 'Map',
      icon: 'Globe',
      to: mapPath
    }
  ])

  const collapserState = collapsed ? 'collapser-collapsed' : 'collapser'

  return <div styleName={cx({ mapView }, collapserState)}
    className={className}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed}
            onClick={link.onClick} />)}
        <li styleName={cx('item', 'topicItem')}>
          <Link to={topicsUrl(communitySlug)}>
            <Icon name='Topics' />
          </Link>
        </li>
      </ul>
      {!hideTopics && <TopicNavigation
        collapsed={collapsed}
        backUrl={rootPath}
        routeParams={routeParams}
        communityId={communityId} />}
    </div>
  </div>
}
