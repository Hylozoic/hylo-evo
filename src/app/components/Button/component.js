import React from 'react'
import cx from 'classnames'

const { string, bool } = React.PropTypes

export default function Button ({ label, color = 'green', hover, active, narrow, small, className }) {
  let styleName = cx('button', color, {hover, active, narrow, small})
  return <div styleName={styleName} className={className}>
    {label}
  </div>
}
Button.propTypes = {
  label: string.isRequired,
  color: string,
  className: string,
  hover: bool,
  narrow: bool,
  small: bool,
  active: bool
}
