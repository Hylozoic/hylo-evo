import React from 'react'
import { Route, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import BadgedIcon from 'components/BadgedIcon'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import cx from 'classnames'
import classes from './NavLink.module.scss'

export default function NavLink ({ to, exact, label, icon, badge, onClick, collapsed = false, home = false, externalLink }) {
  if (externalLink) {
    return (
      <li className={cx(classes.item, { [classes.collapsed]: collapsed })}>
        <a href={externalLink} target='_blank' rel='noreferrer' className={cx(classes.link, { [classes.collapsed]: collapsed })} onClick={onClick}>
          <BadgedIcon name={icon} showBadge={collapsed && badge} className={classes.icon} />
          <span className={classes.label}>{label}</span>
          <Badge number={badge} expanded={!collapsed} />
          {home ? <Icon name='Home' /> : ''}
        </a>
      </li>
    )
  }

  const location = useLocation()
  const active = location.pathname === to

  return (
      <li className={cx(classes.item, { [classes.active]: active, [classes.collapsed]: collapsed })}>
        <Link to={to} className={cx(classes.link, { [classes.collapsed]: collapsed })} onClick={onClick}>
          <BadgedIcon name={icon} green={active} showBadge={collapsed && badge} className={classes.icon} />
          <span className={classes.label}>{label}</span>
          <Badge number={badge} expanded={!collapsed} />
          {home ? <Icon name='Home' /> : ''}
        </Link>
      </li>
  )
}
