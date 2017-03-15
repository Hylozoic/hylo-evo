import React from 'react'
import { Link } from 'react-router-dom'
import { matchPath } from 'react-router'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import cx from 'classnames'

export default function NavLink (
  // this gets the location param using withRouter, see the index.js
  { to, label, icon, badge, collapsed = false, exact, location },
) {
  const active = !!matchPath(location.pathname, {
    path: to,
    exact
  })

  return <li styleName={cx('item', {active})}>
    <Link to={to} styleName={cx('link', {collapsed: collapsed})}>
      <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} styleName='icon' />
      <span styleName='label'>{label}</span>
      {badge && <Badge number={badge} styleName='badge' expanded={!collapsed} />}
    </Link>
  </li>
}
