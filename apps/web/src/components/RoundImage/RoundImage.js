import { string, bool, func } from 'prop-types'
import React from 'react'
import cx from 'classnames'
import { bgImageStyle } from '../../util/index'
import classes from './RoundImage.module.scss'

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
  let imageClasses = cx(
    classes.image,
    {
      [classes.square]: square,
      [classes.overlaps]: overlaps,
      [classes.tiny]: tiny,
      [classes.small]: small,
      [classes.medium]: medium,
      [classes.large]: large,
      [classes.xlarge]: xlarge,
      [classes.overlapsVertical]: overlapsVertical
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
    className={cx(imageClasses, className)}
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
