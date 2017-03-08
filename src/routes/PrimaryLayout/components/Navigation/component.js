import React from 'react'
import { Link } from 'react-router'

export default function Navigation (
  { collapsed }
) {
  return <div styleName={collapsed ? 'navigation-collapsed' : 'navigation'}>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/events'>Events</Link></li>
      <li><Link to='/ui-kit'>UI Kit</Link></li>
    </ul>
  </div>
}
