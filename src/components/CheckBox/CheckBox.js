import React from 'react'
import './CheckBox.scss'
import Icon from 'components/Icon'

const { bool, string, func } = React.PropTypes

export default function CheckBox ({ checked, onChange, className }) {
  const iconName = checked ? 'Checkmark' : 'Empty'
  return <label styleName='label'>
    <Icon name={iconName} styleName='icon' />
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
