import React from 'react'
import Icon from '../Icon'
import cx from 'classnames'
import styles from './component.scss' // eslint-disable-line no-unused-vars

export default function BadgedIcon (props) {
  const { showBadge, green } = props
  const styleNames = cx({green}, showBadge ? 'badge' : 'badge-hidden')
  return <Icon {...props}>
    <span styleName='badgeWrapper'><span styleName={styleNames} /></span>
  </Icon>
}
