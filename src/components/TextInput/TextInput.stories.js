import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import TextInput from 'components/TextInput'

storiesOf('TextInput', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Show', () =>
    <TextInput onChange={() => {}} value={'Here is some text'} />
  )
