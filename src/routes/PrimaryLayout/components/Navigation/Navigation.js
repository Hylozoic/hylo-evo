import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'
import { compact, get } from 'lodash/fp'

export default function Navigation ({
  className,
  collapsed,
  community,
  homeBadge,
  clearBadge
}) {
  const links = compact([
    {
      label: 'Home',
      icon: 'Home',
      to: community ? `/c/${community.slug}` : '/all',
      badge: homeBadge,
      onClick: clearBadge,
      exact: true
    },
    community && {
      label: 'Members',
      icon: 'Members',
      to: `/c/${community.slug}/members`
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
      <TopicNavigation slug={get('slug', community)} />
    </div>
  </div>
}
