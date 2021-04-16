import { string, bool, func } from 'prop-types'
import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from '../../util/index'
import './RoundImage.scss'

export default function RoundImage ({
  url,
  tiny,
  small,
  medium,
  large,
  xlarge,
  overlaps,
  overlapsVertical,
  className,
  square,
  size,
  onClick,
  withBorder = true
}) {
  let styleName = cx(
    'image', {
      square,
      overlaps,
      tiny,
      small,
      medium,
      large,
      xlarge,
      'overlaps-vertical': overlapsVertical
    }
  )
  var style = bgImageStyle(url)
  if (size) {
    style = { ...style, width: size, height: size }
  }
  if (!withBorder) {
    style = { ...style, borderWidth: 0 }
  }
  return <div
    style={style}
    styleName={styleName}
    className={className}
    onClick={onClick}
  />
}
RoundImage.propTypes = {
  url: string,
  tiny: bool,
  small: bool,
  medium: bool,
  large: bool,
  overlaps: bool,
  onClick: func,
  className: string
}
