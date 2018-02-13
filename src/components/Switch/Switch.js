import React from 'react'
import './Switch.scss'

export default function Switch ({
  value,
  onClick,
  className
}) {
  return <div className={className} styleName='switch-container' onClick={onClick}>
    <div styleName='circle-gray-1' />
    <div styleName='connect-gray' />
    <div styleName='circle-gray-2' />
    <div styleName={value ? 'switch-on' : 'switch-off'} />
  </div>
}
