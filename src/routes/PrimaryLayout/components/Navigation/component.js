import React from 'react'
import { Link } from 'react-router'
import Icon from 'components/Icon'

export default function Navigation (
  { collapsed }
) {
  return <div styleName={collapsed ? 'navigation-collapsed' : 'navigation'}>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/events'>Events</Link></li>
      <li><Link to='/ui-kit'>UI Kit</Link></li>
      <li>
        <Icon name='Home' />
        Home
      </li>
      <li>
        <Icon name='Topics' />
        Topics
      </li>
      <li>
        <Icon name='Events' />
        Events
      </li>
      <li>
        <Icon name='Projects' />
        Projects
      </li>
    </ul>
  </div>
}
