import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import './SettingsControl.scss'

export default function SettingsControl ({ label, value = '', onChange, type }) {
  var control

  switch (type) {
    case 'textarea':
      control = <TextareaAutosize minRows={1} maxRows={3} styleName='control-input' value={value} onChange={onChange} />
      break
    case 'password':
      control = <input styleName='control-input' type='password' value={value} onChange={onChange} />
      break
    default:
      control = <input styleName='control-input' type='text' value={value} onChange={onChange} />
      break
  }

  return <div styleName='control'>
    <label styleName='control-label'>{label}</label>
    {control}
  </div>
}
