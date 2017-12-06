import PropTypes from 'prop-types'
import React from 'react'
import './component.scss'

const { string } = PropTypes

export default function ColorSample ({ color, colorName, opacity = 1, textColor = '#FFF', borderColor, description }) {
  const circleStyle = {
    backgroundColor: color,
    border: borderColor ? `${borderColor} 1px solid` : null,
    opacity
  }

  const tailStyle = {
    backgroundColor: borderColor || color,
    opacity: borderColor ? 1 : opacity
  }

  return <div styleName='colorSample'>
    <div styleName='circle' style={circleStyle}>
      <div styleName='label' style={{color: textColor}}>
        {colorName}
      </div>
    </div>
    {description && <div styleName='tailSection'>
      <div styleName='tail' style={tailStyle} />
      <div styleName='smallCircle' style={tailStyle} />
      <div styleName='description'>{description}</div>
    </div>}
  </div>
}
ColorSample.propTypes = {
  color: string,
  colorName: string,
  opacity: string,
  textColor: string,
  borderColor: string,
  description: string
}
