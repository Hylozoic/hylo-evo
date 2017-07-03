import React from 'react'
import './component.scss'
import cx from 'classnames'

export default function Badge ({ number, expanded, className, border }) {
  if (!number) return null
  return <span styleName='badgeWrapper' className={className}>
    <span styleName={cx(expanded ? 'badge' : 'badge-collapsed', {border})}>
      <span styleName={expanded ? 'badgeNumber' : 'badgeNumber-collapsed'}>{number}</span>
    </span>
  </span>
}
