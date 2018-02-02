import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'
import { compact } from 'lodash/fp'

export default function Navigation (props) {
  const {
    className,
    collapsed,
    rootId,
    rootSlug,
    rootPath,
    membersPath,
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

  const links = compact([
    rootPath && {
      label: 'Home',
      icon: 'Home',
      to: rootPath,
      badge: badge,
      onClick: homeOnClick,
      exact: true
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
      {showTopics && <TopicNavigation backUrl={rootPath} communityId={rootId} communitySlug={rootSlug} collapsed={collapsed} />}
    </div>
  </div>
}
