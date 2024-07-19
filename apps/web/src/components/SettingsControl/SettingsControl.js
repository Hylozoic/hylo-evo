import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import LocationInput from 'components/LocationInput'
import IconSelector from 'components/IconSelector'
import cx from 'classnames'
import './SettingsControl.scss'

export default function SettingsControl (props) {
  const { helpText, label, value = '', onChange, renderControl, type, error, controlClass, ...otherProps } = props
  let control

  if (renderControl) {
    control = renderControl(props)
  } else {
    switch (type) {
      case 'textarea':
        control = (
          <TextareaAutosize
            minRows={1}
            maxRows={100}
            onChange={onChange}
            styleName='control-input'
            value={value}
            {...otherProps}
          />
        )
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
        control = (
          <input
            autoComplete='new-password'
            autoCorrect='off'
            onChange={onChange}
            spellCheck='off'
            styleName='control-input'
            type='password'
            value={value}
            {...otherProps}
          />
        )
        break
      case 'location':
        control = (
          <LocationInput
            onChange={onChange}
            saveLocationToDB
            {...otherProps}
          />
        )
        break
      default:
        control = (
          <input
            onChange={onChange}
            styleName='control-input'
            type='text'
            value={value}
            {...otherProps}
          />
        )
        break
    }
  }

  return (
    <div styleName={cx('control', { error })} className={controlClass}>
      <label styleName={cx('control-label', { error })}>
        {label}
        {helpText
          ? <div styleName='help'>?<div styleName='helpTooltip'>{helpText}</div></div>
          : ''
        }
      </label>

      {control}
    </div>
  )
}
