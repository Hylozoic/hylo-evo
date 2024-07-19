import React from 'react'
import Icon from '../Icon'
import cx from 'classnames'
import './component.scss'

export default function BadgedIcon (props) {
  const { className, showBadge, green, ...rest } = props
  const styleNames = cx({ green }, showBadge ? 'badge' : 'badge-hidden')
  return (
    <Icon {...rest} green={green} className={className}>
      <span styleName='badgeWrapper'><span styleName={styleNames} /></span>
    </Icon>
  )
}
