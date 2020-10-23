import React from 'react'
import cx from 'classnames'
import './Icon.scss'

export default function Icon ({
  name,
  className,
  green,
  children,
  onClick,
  onHover,
  dataTip,
  dataTipFor
}) {
  const iconClassName = `icon-${name}`

  return <span
    styleName={cx('icon', { green })}
    className={cx(iconClassName, className)}
    onClick={onClick}
    onHover={onHover}
    data-tip={dataTip}
    data-for={dataTipFor}>
    {children}
  </span>
}
