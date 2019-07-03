import React from 'react'
import { storiesOf } from '@storybook/react'
import SettingsControl from './SettingsControl'

storiesOf('SettingsControl', module)
  .add('simple input', () => (
    <SettingsControl
      type='text'
    />
  ),
  {notes: 'Various types of input: text, password, textarea and text with label input'}
  )
  .add('input password', () => (
    <SettingsControl
      type='password'
    />
  ))
  .add('textarea', () => (
    <SettingsControl
      type='textarea'
    />
  ))
  .add('with label', () => (
    <SettingsControl
      type='text'
      label='label input'
    />
  ))
  .add('disabled', () => (
    <SettingsControl
      type='text'
      disabled
    />
  ))
