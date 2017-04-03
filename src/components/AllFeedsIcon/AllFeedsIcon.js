import React from 'react'
import Icon from 'components/Icon'
import './component.scss'

export default function AllFeedsIcon () {
  return <span styleName='allFeedsIcon'>
    <Icon name='Circle' styleName='purple circleIcon' />
    <Icon name='Circle' styleName='blue circleIcon' />
    <Icon name='Circle' styleName='green circleIcon' />
  </span>
}
