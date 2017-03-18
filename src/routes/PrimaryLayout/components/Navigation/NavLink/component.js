import React from 'react'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import cx from 'classnames'

export default function NavLink (
  { to, label, icon, badge, active, collapsed = false }
) {
  return <li styleName={cx('item', {active})}>
    <Link to={to} styleName={cx('link', {collapsed: collapsed})}>
      <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} styleName='icon' />
      <span styleName='label'>{label}</span>
      {badge && <Badge number={badge} styleName='badge' expanded={!collapsed} />}
    </Link>
  </li>
}
