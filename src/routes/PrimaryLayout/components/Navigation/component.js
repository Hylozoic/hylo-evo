import React from 'react'
import { Link } from 'react-router'
import Icon from 'components/Icon'
import cx from 'classnames'

export default function Navigation (
  { collapsed, styles }
) {

  console.log('props', {collapsed, styles})

  const links = [
    {label: 'Home', icon: 'Home', to: '/', badge: 2},
    {label: 'Events', icon: 'Events', to: '/events', active: true},
    {label: 'UI Kit', icon: 'Projects', to: '/ui-kit'}
  ]

  return <div styleName={collapsed ? 'navigation--collapsed' : 'navigation'}>
    <ul styleName='links'>
      {links.map(link => <li key={link.label} styleName={cx('item', {active: link.active})}>
        <Link to={link.to} styleName='link'>
          <Icon name={link.icon} green={link.active} styleName='icon' />
          {link.label}
          {link.badge && <span styleName='badge'><span styleName='badgeNumber'>{link.badge}</span></span>}
        </Link>
      </li>)}
    </ul>
  </div>
}
