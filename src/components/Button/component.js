import React from 'react'
import cx from 'classnames'
import './component.scss'

const { string, bool } = React.PropTypes

export default function Button ({ label, color = 'green', hover, active, narrow, small, children, className }) {
  let styleName = cx('button', color, {hover, active, narrow, small})
  return <div styleName={styleName} className={className}>
    {label || children}
  </div>
}
Button.propTypes = {
  label: string,
  children: string,
  color: string,
  className: string,
  hover: bool,
  narrow: bool,
  small: bool,
  active: bool
}
