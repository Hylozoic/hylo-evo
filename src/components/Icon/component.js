import React from 'react'
import cx from 'classnames'
import styles from './component.scss' // eslint-disable-line no-unused-vars

export default function Icon ({ name, className, green, children }) {
  const iconClassName = `icon-${name}`
  return <span styleName={cx(iconClassName, 'icon', {green})} className={cx(iconClassName, className)}>
    {children}
  </span>
}
