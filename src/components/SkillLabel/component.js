import React from 'react'
import cx from 'classnames'

const { string, bool } = React.PropTypes

export default function SkillLabel ({ label, color = 'dark', active, className }) {
  let styleName = cx('label', color, {active})
  return <div styleName={styleName} className={className}>
    {label}
  </div>
}
SkillLabel.propTypes = {
  label: string,
  color: string,
  active: bool,
  className: string
}
