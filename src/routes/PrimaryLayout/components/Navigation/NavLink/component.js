import React from 'react'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import cx from 'classnames'

export default function NavLink (
  { to, label, icon, badge, collapsed = false, indexOnly = false, match },
) {
  const active = false
  // TODO: Replace with direct routes
  // router.isActive(to, indexOnly)

  return <li styleName={cx('item', {active})}>
    <Link to={to} styleName={cx('link', {collapsed: collapsed})}>
      <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} styleName='icon' />
      <span styleName='label'>{label}</span>
      {badge && <Badge number={badge} styleName='badge' expanded={!collapsed} />}
    </Link>
  </li>
}
NavLink.contextTypes = {
  router: React.PropTypes.object,
  collapsed: React.PropTypes.bool
}
