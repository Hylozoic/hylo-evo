import React from 'react'
import './Select.scss'
import { defaultTo } from 'lodash'

export default function Select ({ options, selected, onChange, placeholder, fullWidth = false }) {
  const style = fullWidth ? {
    width: '100%'
  } : { }

  return <label styleName='select-wrapper' style={style} >
    <select styleName='select' style={style} onChange={e => onChange(e.target.value)} value={defaultTo(selected, '')}>
      {placeholder && <option value='' disabled>{placeholder}</option>}
      {options.map(({ id, label }) => <option value={id} key={id}>
        {label}
      </option>)}
    </select>
  </label>
}
