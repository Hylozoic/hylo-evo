import React from 'react'
import cx from 'classnames'
import './component.scss'

export default function Icon ({ name, className, green, children, onClick, dataTip, dataTipFor }) {
  const iconClassName = `icon-${name}`
  return <span styleName={cx('icon', { green })} onClick={onClick} data-tip={dataTip} data-for={dataTipFor}
    className={cx(iconClassName, className)}>
    {children}
  </span>
}
