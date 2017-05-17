import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'

export default function Navigation ({
  className,
  collapsed,
  slug,
  homePath,
  homeBadge,
  resetNewPostCount
}) {
  const links = [
    {
      label: 'Home',
      icon: 'Home',
      to: homePath,
      badge: homeBadge,
      exact: true,
      onClick: () => !!homeBadge && resetNewPostCount(slug)
    },
    {
      label: 'Members',
      icon: 'Members',
      to: `/c/${slug}/members`
    },
    {
      label: 'UI Kit',
      icon: 'Projects',
      to: '/ui-kit'
    }
  ]

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}
    className={className}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed}
            onClick={link.onClick} />)}
      </ul>
      <TopicNavigation slug={slug} />
    </div>
  </div>
}
