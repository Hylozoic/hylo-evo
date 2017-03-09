import React from 'react'
import { Link } from 'react-router'
import Icon from 'components/Icon'

export default function Navigation (
  { collapsed }
) {
  return <div styleName={collapsed ? 'navigation-collapsed' : 'navigation'}>
    <ul>
      <li>
        <Link to='/'>
          <Icon name='Home' />
          Home
        </Link>
      </li>
      <li>
        <Link to='/events'>
          <Icon name='Events' green />
          Events
        </Link>
      </li>
      <li>
        <Link to='/ui-kit'>
          <Icon name='Projects' />
          UI Kit
        </Link>
      </li>
    </ul>
  </div>
}
