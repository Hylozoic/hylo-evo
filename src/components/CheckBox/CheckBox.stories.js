import React from 'react'
import { storiesOf } from '@storybook/react'
import CheckBox from './CheckBox'

storiesOf('Checkbox', module)
  .add('simple', () => (
    <CheckBox />
  ),
  { notes: 'Simple Checkbox button with and without label the component' }
  )
  .add('checked', () => (
    <CheckBox checked />
  ))
  .add('With Label', () => (
    <CheckBox label='labelCheck' />
  ))
  .add('with Label to the left', () => (
    <CheckBox label='labelCheck' labelLeft checked />
  ))
