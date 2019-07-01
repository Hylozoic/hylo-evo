import React from 'react'
import { storiesOf } from '@storybook/react'
import SettingsControl from './SettingsControl'

storiesOf('SettingsControl', module)
  .add('simple input', () => (
    <SettingsControl
      type='text'
    />
  ))
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
