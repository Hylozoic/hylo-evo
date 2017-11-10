import React from 'react'
import './component.scss'
import cx from 'classnames'

export default function Badge ({ number, expanded, className, border, onClick }) {
  if (!number) return null
  return <span styleName='badgeWrapper' className={className} onClick={onClick}>
    <span styleName={cx(expanded ? 'badge' : 'badge-collapsed', {border})}>
      <span styleName={expanded ? 'badgeNumber' : 'badgeNumber-collapsed'}>{number}</span>
    </span>
  </span>
}
