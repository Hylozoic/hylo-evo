import React from 'react'
import Icon from 'components/Icon'
import './Select.scss'

export default function Select ({ options, selected, onChange, placeholder, fullWidth = false }) {
  const style = fullWidth ? {
    width: '100%'
  } : { }

  return <span styleName='select-wrapper'>
    <select styleName='select' style={style} onChange={e => onChange(e.target.value)} value={selected}>
      {placeholder && <option value='' disabled>{placeholder}</option>}
      {options.map(({id, label}) => <option value={id} key={id}>
        {label}
      </option>)}
    </select>
    <Icon name='ArrowDown' styleName='icon' />
  </span>
}
