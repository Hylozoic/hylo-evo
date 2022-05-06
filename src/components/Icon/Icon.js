import React from 'react'
import cx from 'classnames'
import './Icon.scss'

export default function Icon ({
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

  return <span
    styleName={cx('icon', { green, blue })}
    className={cx(iconClassName, className)}
    onClick={onClick}
    data-tip={dataTip}
    data-for={dataTipFor}>
    {children}
  </span>
}
