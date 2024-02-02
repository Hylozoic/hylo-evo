import React, { forwardRef } from 'react'
import cx from 'classnames'
import './Icon.scss'

function Icon ({
  name,
  className,
  green,
  blue,
  children,
  onClick,
  dataTip,
  dataTipFor
}) {
  const iconClassName = `icon-${name}`

  return (
    <span
      styleName={cx('icon', { green, blue })}
      className={cx(iconClassName, className)}
      onClick={onClick}
      data-tip={dataTip}
      data-for={dataTipFor}
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
  dataTip,
  dataTipFor,
  ...rest
}, ref) => {
  const iconClassName = `icon-${name}`

  return (
    <span
      styleName={cx('icon', { green, blue })}
      className={cx(iconClassName, className)}
      onClick={onClick}
      data-tip={dataTip}
      data-for={dataTipFor}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  )
})

export default Icon
