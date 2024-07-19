import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import './Button.scss'

const { string, bool, func, object, oneOfType, node } = PropTypes

export default function Button ({
  active,
  borderRadius = '25px',
  children,
  className,
  color = 'green',
  dataTestId,
  dataTip,
  dataFor,
  disabled = false,
  hover,
  label,
  narrow,
  noDefaultStyles,
  onClick,
  small,
  tabIndex = 0
}) {
  const buttonClassName = noDefaultStyles ? '' : 'button'
  const styleName = cx(buttonClassName, color, { hover, active, narrow, small, disabled })

  return (
    <div
      role='button'
      tabIndex={tabIndex}
      styleName={styleName}
      style={{ borderRadius }}
      className={className}
      onClick={!disabled ? onClick : undefined}
      data-tip={dataTip}
      data-for={dataFor}
      data-testid={dataTestId}
    >
      {label || children}
    </div>
  )
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
