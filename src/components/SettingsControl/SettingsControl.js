import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import LocationInput from 'components/LocationInput'
import IconSelector from 'components/IconSelector'
import cx from 'classnames'
import './SettingsControl.scss'

export default function SettingsControl (props) {
  const { label, value = '', onChange, renderControl, type, error, controlClass, ...otherProps } = props
  let control

  if (renderControl) {
    control = renderControl(props)
  } else {
    switch (type) {
      case 'textarea':
        control = <TextareaAutosize minRows={1}
          maxRows={100}
          styleName='control-input'
          value={value}
          onChange={onChange}
          {...otherProps} />
        break
      case 'icon-selector':
        control = (
          <IconSelector
            selectedIcon={value}
            updateIcon={onChange}
            {...otherProps}
          />
        )
        break
      case 'password':
        control = <input styleName='control-input'
          type='password'
          value={value}
          onChange={onChange}
          autoComplete='new-password'
          autoCorrect='off'
          spellCheck='off'
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
  }

  return <div styleName={cx('control', { error })} className={controlClass}>
    <label styleName={cx('control-label', { error })}>{label}</label>
    {control}
  </div>
}
