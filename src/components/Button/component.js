import React, { PropTypes } from 'react'
import cx from 'classnames'
import './component.scss'

const { string, bool, func, object, oneOfType } = PropTypes

export default function Button ({ label, color = 'green', hover, active, narrow, small, children, onClick, className }) {
  let styleName = cx('button', color, {hover, active, narrow, small})
  return <div styleName={styleName} className={className} onClick={onClick}>
    {label || children}
  </div>
}
Button.propTypes = {
  label: oneOfType([
    string,
    object
  ]),
  children: string,
  onClick: func,
  color: string,
  className: string,
  hover: bool,
  narrow: bool,
  small: bool,
  active: bool
}
