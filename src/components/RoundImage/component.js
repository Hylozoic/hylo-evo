// RFC: Started out calling this Avatar, but renamed to RoundImage as it doesn't
// replicate all the functionality of Avatar from the current app. Imagining
// this component will be imported by the Avatar component.
// Not sure if this is too much granularity.

import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import './component.scss'

const { string, bool } = React.PropTypes

export default function RoundImage ({ url, small, medium, overlaps, overlapsVertical, large, xlarge, className }) {
  let styleName = cx('image', { overlaps, small, medium, large, xlarge, 'overlaps-vertical': overlapsVertical })
  return <div styleName={styleName}
    className={className}
    style={bgImageStyle(url)} />
}
RoundImage.propTypes = {
  url: string,
  small: bool,
  medium: bool,
  large: bool,
  overlaps: bool,
  className: string
}
