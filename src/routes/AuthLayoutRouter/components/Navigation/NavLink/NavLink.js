import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import cx from 'classnames'
import './NavLink.scss'

export default function NavLink ({ to, exact, label, icon, badge, onClick, collapsed = false, home = false, externalLink }) {
  if (externalLink) {
    return (
      <li styleName={cx('item', { collapsed: collapsed })}>
        <a href={externalLink} target='_blank' rel='noreferrer' styleName={cx('link', { collapsed: collapsed })} onClick={onClick}>
          <BadgedIcon name={icon} showBadge={collapsed && badge} styleName='icon' />
          <span styleName='label'>{label}</span>
          <Badge number={badge} expanded={!collapsed} />
          {home ? <Icon name='Home' /> : ''}
        </a>
      </li>
    )
  }

  return (
    <Route path={to} exact={exact}>
      {({ match }) => {
        const active = !!match
        return (
          <li styleName={cx('item', { active }, { collapsed })}>
            <Link to={to} styleName={cx('link', { collapsed: collapsed })} onClick={onClick}>
              <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} styleName='icon' />
              <span styleName='label'>{label}</span>
              <Badge number={badge} expanded={!collapsed} />
              {home ? <Icon name='Home' /> : ''}
            </Link>
          </li>
        )
      }}
    </Route>
  )
}
