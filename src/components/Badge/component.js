import React from 'react'

export default function Badge ({ number, expanded, className, parentClassName }) {
  return <span styleName='badgeWrapper' className={className}>
    <span styleName={expanded ? 'badge' : 'badge-collapsed'}>
      <span styleName={expanded ? 'badgeNumber' : 'badgeNumber-collapsed'}>{number}</span>
    </span>
  </span>
}
