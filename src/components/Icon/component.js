import React from 'react'
import cx from 'classnames'
import './component.scss'

export default function Icon ({ name, className, green, children, onClick }) {
  const iconClassName = `icon-${name}`
  return <span styleName={cx('icon', {green})}
    className={cx(iconClassName, className)}
    onClick={onClick}>
    {children}
  </span>
}
