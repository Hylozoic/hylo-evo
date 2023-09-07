import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'components/Icon'

import './CheckBox.scss'

const { bool, string, func } = PropTypes

export default function CheckBox ({ checked, onChange, className, label, labelClass, labelLeft = false, noInput, disabled = false }) {
  const iconName = checked ? 'Checkmark' : 'Empty'

  return (
    <label styleName='label' className={labelClass}>
      {labelLeft && label}
      <Icon name={iconName} styleName={cx('icon', { 'label-left': labelLeft })} />
      {!noInput &&
        <input
          type='checkbox'
          styleName='checkbox'
          className={className}
          checked={!!checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />}
      {!labelLeft && label}
    </label>
  )
}

CheckBox.propTypes = {
  checked: bool,
  className: string,
  disabled: bool,
  label: string,
  labelLeft: bool,
  onChange: func,
  noInput: bool
}
