import PropTypes from 'prop-types'
import React from 'react'
import './CheckBox.scss'
import Icon from 'components/Icon'
import cx from 'classnames'

const { bool, string, func } = PropTypes

export default function CheckBox ({ checked, onChange, className, label, labelLeft = false, noInput }) {
  const iconName = checked ? 'Checkmark' : 'Empty'

  return <label styleName='label'>
    {labelLeft && label}
    <Icon name={iconName} styleName={cx('icon', {'label-left': labelLeft})} />
    {!noInput && <input type='checkbox'
      styleName='checkbox'
      className={className}
      checked={!!checked}
      onChange={e => onChange(e.target.checked)} />}
    {!labelLeft && label}
  </label>
}
CheckBox.propTypes = {
  value: bool,
  onChange: func,
  className: string
}
