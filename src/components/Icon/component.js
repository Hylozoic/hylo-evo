import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import './component.scss'

export default function Icon ({ name, className, green, children, onClick }) {
  const iconClassName = `icon-${name}`
  return <span styleName={cx('icon', { green })} onClick={onClick}
    className={cx(iconClassName, className)}>
    {children}
  </span>
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  green: PropTypes.oneOf(['string', 'bool']),
  children: PropTypes.object,
  onClick: PropTypes.func
}
