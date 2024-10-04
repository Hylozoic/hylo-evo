import React from 'react'
import classes from './Select.module.scss'
import { defaultTo } from 'lodash'

export default function Select ({ disabled, options, selected, onChange, placeholder, fullWidth = false }) {
  const style = fullWidth ? { width: '100%' } : { }

  return (
    <label className={classes.selectWrapper} style={style} >
      <select className={classes.select} style={style} onChange={e => onChange(e.target.value)} value={defaultTo(selected, '')} disabled={disabled}>
        {placeholder && <option value='' disabled>{placeholder}</option>}
        {options.map(({ id, label }) => (
          <option value={id} key={id}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
