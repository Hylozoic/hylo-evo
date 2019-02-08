import React from 'react'
import { get, compact } from 'lodash/fp'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'

export default function Navigation (props) {
  const {
    className,
    collapsed,
    routeParams,
    rootPath,
    membersPath,
    projectsPath,
    communityId,
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
    membersPath && {
      label: 'Members',
      icon: 'Members',
      to: membersPath
    }
  ])

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}
    className={className}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed}
            onClick={link.onClick} />)}
      </ul>
      {!hideTopics && <TopicNavigation
        collapsed={collapsed}
        backUrl={rootPath}
        routeParams={routeParams}
        communityId={communityId} />}
    </div>
  </div>
}
