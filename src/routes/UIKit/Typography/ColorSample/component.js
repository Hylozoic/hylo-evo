import React from 'react'
import styles from './component.scss' // eslint-disable-line no-unused-vars

const { string } = React.PropTypes

export default function ColorSample ({ color, colorName, opacity = 1, textColor = '#FFF', borderColor, description }) {
  const colorLabel = opacity !== 1 ? `${opacity * 100}%` : color
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
        {colorLabel}
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
