import React from 'react'
import cx from 'classnames'

export default function Badge ({ number, expanded, className, parentClassName }) {
  console.log('parentClassName', parentClassName)
  return <span styleName='badgeWrapper' className={className}>
    <span styleName={cx('badge', {'badge--collapsed': !expanded})}>
      <span styleName={cx('badgeNumber', {'badgeNumber--collapsed': !expanded})}>{number}</span>
    </span>
  </span>
}
