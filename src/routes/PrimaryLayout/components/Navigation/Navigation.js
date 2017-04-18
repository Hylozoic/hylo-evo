import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './Navigation.scss'
import { getSlugInPath } from 'util/index'

export default function Navigation ({ className, collapsed, location }) {
  const style = collapsed ? {} : {position: 'fixed'}
  const slug = getSlugInPath(location.pathname)

  const links = [
    {label: 'Home', icon: 'Home', to: `/c/${slug}`, badge: 3, exact: true},
    {label: 'Events', icon: 'Events', to: `/c/${slug}/events`, badge: 3},
    {label: 'Members', icon: 'Members', to: `/c/${slug}/members`},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}
    className={className}>
    <div styleName='navigation' style={style}>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed} />)}
      </ul>
      <TopicNavigation />
    </div>
  </div>
}
