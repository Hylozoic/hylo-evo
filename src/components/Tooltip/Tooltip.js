import React from 'react'
import ReactTooltip from 'react-tooltip'
import './Tooltip.scss'

const Tooltip = (props) => {
  const { id, delay, offset } = props
  return (
    <ReactTooltip
      id={id}
      effect='solid'
      style='light'
      border
      // :TODO: de-duplicate these colour values
      textColor='#2A4059'
      borderColor='#40A1DD'
      backgroundColor='white'
      offset={offset || { 'top': -2 }}
      delayShow={delay || 500}
      styleName='tooltip' />
  )
}

export default Tooltip
