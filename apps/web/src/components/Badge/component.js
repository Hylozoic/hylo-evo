import cx from 'classnames'
import React from 'react'
import classes from './component.module.scss'

export default function Badge ({ number, expanded, className, border, onClick }) {
  if (!number) return null
  return <span className={cx(classes.badgeWrapper, className)} onClick={onClick}>
    <span className={cx(expanded ? classes.badge : classes.badgeCollapsed, { [classes.border]: border })}>
      <span className={expanded ? classes.badgeNumber : classes.badgeNumberCollapsed}>{number}</span>
    </span>
  </span>
}
