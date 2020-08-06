import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import LocationInput from 'components/LocationInput'
import './SettingsControl.scss'

export default function SettingsControl ({ label, value = '', onChange, type, ...otherProps }) {
  var control

  switch (type) {
    case 'textarea':
      control = <TextareaAutosize minRows={1}
        maxRows={100}
        styleName='control-input'
        value={value}
        onChange={onChange}
        {...otherProps} />
      break
    case 'password':
      control = <input styleName='control-input'
        type='password'
        value={value}
        onChange={onChange}
        {...otherProps} />
      break
    case 'location':
      control = <LocationInput
        saveLocationToDB
        onChange={onChange}
        {...otherProps}
      />
      break
    default:
      control = <input styleName='control-input'
        type='text'
        value={value}
        onChange={onChange}
        {...otherProps} />
      break
  }

  return <div styleName='control'>
    <label styleName='control-label'>{label}</label>
    {control}
  </div>
}
