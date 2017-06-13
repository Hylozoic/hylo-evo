import React from 'react'
import './CheckBox.scss'
import cx from 'classnames'

const { bool, string, func } = React.PropTypes

export default function CheckBox ({ checked, onChange, className }) {
  return <label styleName={cx('label', {checked})}>
    <input type='checkbox'
      styleName='checkbox'
      className={className}
      checked={checked}
      onChange={e => onChange(e.target.checked)} />
    </label>
}
CheckBox.propTypes = {
  value: bool,
  onChange: func,
  className: string
}
