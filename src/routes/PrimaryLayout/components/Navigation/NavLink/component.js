import React from 'react'
import { Link } from 'react-router'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import cx from 'classnames'

export default function NavLink (
  { to, label, icon, badge, indexOnly = false }, { router, collapsed }
) {
  const active = router.isActive(to, indexOnly)

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
