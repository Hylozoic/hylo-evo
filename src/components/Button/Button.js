import React, { PropTypes } from 'react'
import cx from 'classnames'
import './Button.scss'

const { string, bool, func, object, oneOfType } = PropTypes

export default function Button ({
  label,
  color = 'green',
  hover,
  active,
  narrow,
  small,
  disabled = false,
  children,
  onClick,
  className,
  tabIndex = 0
}) {
  let styleName = cx('button', color, {hover, active, narrow, small, disabled})
  return <div
    role='button'
    tabIndex={tabIndex}
    styleName={styleName}
    className={className}
    onClick={!disabled && onClick}
    onKeyPress={event => {
      if (!disabled && event.key === 'Enter' && onClick) {
        onClick()
      }
    }}
  >
    {label || children}
  </div>
}
Button.propTypes = {
  label: oneOfType([
    string,
    object
  ]),
  color: string,
  hover: bool,
  active: bool,
  narrow: bool,
  small: bool,
  children: string,
  onClick: func,
  disabled: bool,
  className: string
}
