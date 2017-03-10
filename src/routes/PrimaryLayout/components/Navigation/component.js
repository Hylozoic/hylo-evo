import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'

export default function Navigation (
  { collapsed }
) {
  const links = [
    {label: 'Home', icon: 'Home', to: '/'},
    {label: 'Events', icon: 'Events', to: '/events', active: true, badge: 3},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]

  return <div styleName={collapsed ? 'navigation navigation--collapsed' : 'navigation'}>
    <ul styleName='links'>
      {links.map(link => <NavLink key={link.label} {...link} />)}
    </ul>
    <TopicNavigation />
  </div>
}
