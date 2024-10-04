import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import classes from './component.module.scss'

const { string, bool } = PropTypes

export default function SkillLabel ({ children, label, color = 'dark', active, className }) {
  let labelClasses = cx(classes.label, classes[color], { [classes.active]: active })
  return <div className={cx(labelClasses, className)}>
    {label || children}
  </div>
}
SkillLabel.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
