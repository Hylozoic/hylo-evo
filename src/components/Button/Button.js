import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import './Button.scss'

const { string, bool, func, object, oneOfType, node } = PropTypes

export default function Button ({
  label,
  color = 'green',
  hover,
  active,
  narrow,
  small,
  noDefaultStyles,
  disabled = false,
  children,
  onClick,
  className,
  tabIndex = 0
}) {
  const buttonClassName = noDefaultStyles ? '' : 'button'
  let styleName = cx(buttonClassName, color, { hover, active, narrow, small, disabled })

  return <div
    role='button'
    tabIndex={tabIndex}
    styleName={styleName}
    className={className}
    onClick={!disabled ? onClick : undefined}
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
  children: node,
  noDefaultStyles: bool,
  onClick: func,
  disabled: bool,
  className: string
}
