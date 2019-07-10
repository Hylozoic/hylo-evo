import React from 'react'
import { storiesOf } from '@storybook/react'
import CheckBox from './CheckBox'

storiesOf('Checkbox', module)
  .add('simple', () => (
    <CheckBox onChange={e => console.log(e)} />
  ),
  { notes: 'Simple Checkbox button with and without label the component' }
  )
  .add('checked',
    () => (
      <CheckBox checked onChange={e => console.log(e)} />
    ),
    { notes: 'the checking/unchecking must be processed by the parent component using the onChange prop' }
  )
  .add('With Label',
    () => (
      <CheckBox label='labelCheck' onChange={e => console.log(e)} />
    ),
    { notes: 'the checking/unchecking must be processed by the parent component using the onChange prop' }
  )
  .add('with Label to the left',
    () => (
      <CheckBox label='labelCheck' labelLeft checked onChange={e => console.log(e)} />
    ),
    { notes: 'the checking/unchecking must be processed by the parent component using the onChange prop' }
  )
