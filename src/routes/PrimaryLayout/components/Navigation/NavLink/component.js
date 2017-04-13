import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import cx from 'classnames'
import './component.scss'

export default function NavLink (
  { to, exact, label, icon, badge, collapsed = false }
) {
  return <Route path={to} exact={exact}
    children={({ location, match }) => {
      const active = !!match
      return <li styleName={cx('item', {active})}>
        <Link to={to} styleName={cx('link', {collapsed: collapsed})}>
          <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} styleName='icon' />
          <span styleName='label'>{label}</span>
          {badge && <Badge number={badge} styleName='badge' expanded={!collapsed} />}
        </Link>
      </li>
    }} />
}
