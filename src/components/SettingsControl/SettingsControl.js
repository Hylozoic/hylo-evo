import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import LocationInput from 'components/LocationInput'
import cx from 'classnames'
import './SettingsControl.scss'

export default function SettingsControl (props) {
  const { label, value = '', onChange, renderControl, type, error, ...otherProps } = props
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
      case 'hidden':
        const hiddenInput = <input styleName='control-input'
          type='hidden'
          value={value}
          onChange={onChange}
          autoCorrect='off'
          spellCheck='off'
          {...otherProps}
        />
        control = label
          ? <><label styleName={cx('control-label', { error })}>{label}</label>{ hiddenInput }</>
          : hiddenInput
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

  return type === 'hidden' ? control : <div styleName={cx('control', { error })}>
    <label styleName={cx('control-label', { error })}>{label}</label>
    {control}
  </div>
}
