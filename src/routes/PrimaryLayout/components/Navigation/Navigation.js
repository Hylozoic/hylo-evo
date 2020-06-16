import React from 'react'
import NavLink from './NavLink'
import cx from 'classnames'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'
import { compact } from 'lodash/fp'
import { EVENTS } from 'config/featureFlags'

export default function Navigation (props) {
  const {
    currentUser,
    className,
    collapsed,
    rootId,
    rootSlug,
    rootPath,
    membersPath,
    projectsPath,
    eventsPath,
    mapPath,
    mapView,
    badge,
    clearBadge,
    clearFeedList,
    showTopics
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

  return <div styleName={cx({ mapView }, collapserState)} // this currently collapses when a post is opened. Will have to modify behavior to suit map needs
    className={className}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed}
            onClick={link.onClick} />)}
      </ul>
      { /* Based on the current design, we'd need to add a conditional (MapView === true ? show map nav : hide map nav ) */ }
      {/* state changes in this MapNavigation, with all of its filtering toggles, would need to be connected to parts of the app outside */}
      {/* So either throwing it into a store or perhaps sharing a custom hook. */}
      {showTopics && <TopicNavigation backUrl={rootPath} communityId={rootId} communitySlug={rootSlug} collapsed={collapsed} />}
    </div>
  </div>
}
