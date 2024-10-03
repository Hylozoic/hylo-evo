import React from 'react'
import Icon from '../Icon'
import cx from 'classnames'
import classes from './component.module.scss'

export default function BadgedIcon (props) {
  const { className, showBadge, green, ...rest } = props
  const badgeClass = cx(
    { [classes.green]: green },
    showBadge ? classes.badge : classes.badgeHidden
  )
  return (
    <Icon {...rest} className={cx(className, { [classes.green]: green })}>
      <span className={classes.badgeWrapper}>
        <span className={badgeClass} />
      </span>
    </Icon>
  )
}
