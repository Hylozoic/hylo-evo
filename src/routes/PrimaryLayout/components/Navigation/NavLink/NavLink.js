import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import cx from 'classnames'
import './NavLink.scss'

export default function NavLink (
  { to, exact, label, icon, badge, onClick, collapsed = false, home = false }
) {
  return <Route path={to} exact={exact}
    children={({ location, match }) => {
      const active = !!match
      return <li styleName={cx('item', { active })}>
        <Link to={to} styleName={cx('link', { collapsed: collapsed })}
          onClick={onClick}>
          <BadgedIcon name={icon} green={active} showBadge={collapsed && badge}
            styleName='icon' />
          <span styleName='label'>{label}</span>
          <Badge number={badge} expanded={!collapsed} />
          {home ? <Icon name='Home' /> : ''}
        </Link>
      </li>
    }} />
}
