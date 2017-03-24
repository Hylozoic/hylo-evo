import React from 'react'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import styles from './component.scss' // eslint-disable-line no-unused-vars

export default function Navigation ({ location, collapsed }) {
  let links = [
    {label: 'Home', icon: 'Home', to: '/'},
    {label: 'Events', icon: 'Events', to: '/events', badge: 3},
    {label: 'Members', icon: 'Members', to: '/members'},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]
  links = links.map(link => ({...link, active: (link.to === location.pathname)}))

  return <div styleName={collapsed ? 'collapser-collapsed' : 'collapser'}>
    <div styleName='navigation'>
      <ul styleName='links'>
        {links.map(link => <NavLink key={link.label} {...link} collapsed={collapsed} />)}
      </ul>
      <TopicNavigation />
    </div>
  </div>
}
