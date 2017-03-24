import React from 'react'
import styles from './component.scss' // eslint-disable-line no-unused-vars

export default function Badge ({ number, expanded, className, parentClassName }) {
  return <span styleName='badgeWrapper' className={className}>
    <span styleName={expanded ? 'badge' : 'badge-collapsed'}>
      <span styleName={expanded ? 'badgeNumber' : 'badgeNumber-collapsed'}>{number}</span>
    </span>
  </span>
}
