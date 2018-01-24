import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'utils/index'
import './component.scss'

const { string, bool } = PropTypes

export default function RoundImage ({ url, small, medium, overlaps, overlapsVertical, large, xlarge, className, square, size }) {
  let styleName = cx('image', { square, overlaps, small, medium, large, xlarge, 'overlaps-vertical': overlapsVertical })
  var style = bgImageStyle(url)
  if (size) {
    style = {...style, width: size, height: size}
  }
  return <div
    style={style}
    styleName={styleName}
    className={className}
     />
}
RoundImage.propTypes = {
  url: string,
  small: bool,
  medium: bool,
  large: bool,
  overlaps: bool,
  className: string
}
