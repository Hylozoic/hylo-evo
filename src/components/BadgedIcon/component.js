import React from 'react'
import Icon from '../Icon'
import cx from 'classnames'

export default function BadgedIcon (props) {
  const { showBadge, green } = props  
  const styleNames = cx({green}, showBadge ? 'badge' : 'badge-hidden')
  return <Icon {...props}>
    <span styleName={styleNames} />
  </Icon>
}
