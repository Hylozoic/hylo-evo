import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import LocationInput from 'components/LocationInput'
import IconSelector from 'components/IconSelector'
import cx from 'classnames'
import classes from './SettingsControl.module.scss'

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
            className={classes.controlInput}
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
            className={classes.controlInput}
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
            className={classes.controlInput}
            type='text'
            value={value}
            {...otherProps}
          />
        )
        break
    }
  }

  return (
    <div className={cx(classes.control, { [classes.error]: error }, controlClass)}>
      <label className={cx(classes.controlLabel, { [classes.error]: error })}>
        {label}
        {helpText
          ? <div className={classes.help}>?<div className={classes.helpTooltip}>{helpText}</div></div>
          : ''
        }
      </label>

      {control}
    </div>
  )
}
