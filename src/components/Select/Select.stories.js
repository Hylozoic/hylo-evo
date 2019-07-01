import React from 'react'
import { storiesOf } from '@storybook/react'
import Select from './Select'

const options = [
  {
    id: 1,
    label: 'option1'
  },
  {
    id: 2,
    label: 'option2'
  },
  {
    id: 3,
    label: 'option3'
  },
  {
    id: 4,
    label: 'option4'
  }
]

storiesOf('Select', module)
  .add('basic', () => (
    <Select options={options} />
  ))
  .add('full width', () => (
    <Select options={options} fullWidth />
  ))
  .add('with placeholder', () => (
    <Select options={options} placeholder='select one' />
  ))
