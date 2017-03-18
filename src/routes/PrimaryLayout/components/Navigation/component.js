import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'

export default function Navigation ({ location, collapsed }) {
  let links = [
    {label: 'Home', icon: 'Home', to: '/', exact: true},
    {label: 'Events', icon: 'Events', to: '/events', badge: 3},
    {label: 'Members', icon: 'Members', to: '/members'},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link => <NavLink key={link.label} {...link} location={location} collapsed={collapsed} />)}
      </ul>
      <TopicNavigation />
    </div>
  </div>
}
