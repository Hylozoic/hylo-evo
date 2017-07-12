import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import './SettingsControl.scss'

export default function SettingsControl ({ label, value = '', onChange, type }) {
  return <div styleName='control'>
    <label styleName='control-label'>{label}</label>
    {type === 'textarea'
      ? <TextareaAutosize minRows={1} maxRows={3} styleName='control-input' value={value} onChange={onChange} />
      : <input styleName='control-input' type='text' value={value} onChange={onChange} />}
  </div>
}
