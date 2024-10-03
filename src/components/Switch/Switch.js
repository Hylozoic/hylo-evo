import React from 'react'
import cx from 'classnames'
import classes from './Switch.module.scss'

export default function Switch ({
  value,
  onClick,
  className
}) {
  return <div className={cx(className, classes.switchContainer)} onClick={onClick}>
    <div className={classes.circleGray1} />
    <div className={classes.connectGray} />
    <div className={classes.circleGray2} />
    <div className={cx(classes[value ? 'switchOn' : 'switchOff'])} />
  </div>
}
