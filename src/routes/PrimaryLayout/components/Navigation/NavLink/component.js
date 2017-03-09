import React from 'react'
import { Link } from 'react-router'
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import cx from 'classnames'

export default function NavLink (
  { to, label, icon, badge }, { router }
) {
  const active = router.isActive(to, true)

  return <li styleName={cx('item', {active})}>
    <Link to={to} styleName='link'>
      <Icon name={icon} green={active} styleName='icon' />
      {label}
      {badge && <Badge number={badge} expanded styleName='badge' />}
    </Link>
  </li>
}
NavLink.contextTypes = {
  router: React.PropTypes.object
}
