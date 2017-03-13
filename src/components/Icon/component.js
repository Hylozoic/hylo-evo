import React from 'react'
import cx from 'classnames'

export default function Icon ({ name, className, green, children }) {
  const iconClassName = `icon-${name}`
  return <span styleName={cx(iconClassName, 'icon', {green})} className={cx(iconClassName, className)}>
    {children}
  </span>
}
