import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import './component.scss'

const links = [
  {label: 'Home', icon: 'Home', to: '/', badge: 3, exact: true},
  {label: 'Events', icon: 'Events', to: '/events', badge: 3},
  {label: 'Members', icon: 'Members', to: '/members'},
  {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
]

export default function Navigation ({ collapsed }) {
  const style = collapsed ? {} : {position: 'fixed'}

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}>
    <div styleName='navigation' style={style}>
      <ul styleName='links'>
        {links.map(link =>
          <NavLink key={link.label} {...link} collapsed={collapsed} />)}
      </ul>
      <TopicNavigation />
    </div>
  </div>
}
