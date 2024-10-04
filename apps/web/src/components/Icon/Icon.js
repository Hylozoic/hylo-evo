import React, { forwardRef } from 'react'
import cx from 'classnames'
import classes from './Icon.module.scss'

function Icon ({
  name,
  className,
  green,
  blue,
  children,
  onClick,
  tooltipContent,
  tooltipId
}) {
  const iconClassName = `icon-${name}`

  return (
    <span
      className={cx(classes.icon, { [classes.green]: green, [classes.blue]: blue }, iconClassName, className)}
      onClick={onClick}
      data-tooltip-content={tooltipContent}
      data-tooltip-id={tooltipId}
    >
      {children}
    </span>
  )
}

/* Keeping this separate to make testing with <Icon> easier */
export const IconWithRef = forwardRef(({
  name,
  className,
  green,
  blue,
  children,
  onClick,
  tooltipContent,
  tooltipId,
  ...rest
}, ref) => {
  const iconClassName = `icon-${name}`

  return (
    <span
      className={cx(classes.icon, { [classes.green]: green, [classes.blue]: blue }, iconClassName, className)}
      onClick={onClick}
      data-tooltip-content={tooltipContent}
      data-tooltip-id={tooltipId}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  )
})

export default Icon
