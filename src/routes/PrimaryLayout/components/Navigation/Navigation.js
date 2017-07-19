import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'
import { compact } from 'lodash/fp'

export default function Navigation (props) {
  const {
    className,
    collapsed,
    rootSlug,
    rootPath,
    membersPath,
    badge,
    clearBadge
  } = props

  const links = compact([
    {
      label: 'Home',
      icon: 'Home',
      to: rootPath,
      badge: badge,
      onClick: clearBadge,
      exact: true
    },
    membersPath && {
      label: 'Members',
      icon: 'Members',
      to: membersPath
    },
    {
      label: 'UI Kit',
      icon: 'Projects',
      to: '/ui-kit'
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
      <TopicNavigation backUrl={rootPath} communitySlug={rootSlug} collapsed={collapsed} />
    </div>
  </div>
}
