import PropTypes from 'prop-types';
import React from 'react'
import cx from 'classnames'
import './component.scss'

const { string, bool } = PropTypes

export default function SkillLabel ({ children, label, color = 'dark', active, className }) {
  let styleName = cx('label', color, {active})
  return <div styleName={styleName} className={className}>
    {label || children}
  </div>
}
SkillLabel.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
