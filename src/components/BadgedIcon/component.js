import React from 'react'
import Icon from '../Icon'
import cx from 'classnames'
import './component.scss'

export default function BadgedIcon (props) {
  const { className, showBadge, green } = props
  const styleNames = cx({ green }, showBadge ? 'badge' : 'badge-hidden')
  return <Icon {...props} className={className}>
    <span styleName='badgeWrapper'><span styleName={styleNames} /></span>
  </Icon>
}
