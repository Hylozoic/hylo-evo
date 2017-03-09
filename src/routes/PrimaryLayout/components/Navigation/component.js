import React from 'react'
import NavLink from './NavLink'

export default function Navigation (
  { collapsed, styles }
) {
  const links = [
    {label: 'Home', icon: 'Home', to: '/', badge: 2},
    {label: 'Events', icon: 'Events', to: '/events', active: true},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]

  return <div styleName={collapsed ? 'navigation--collapsed' : 'navigation'}>
    <ul styleName='links'>
      {links.map(link => <NavLink key={link.label} {...link} />)}
    </ul>
  </div>
}
