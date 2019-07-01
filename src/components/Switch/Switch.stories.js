import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Switch from './Switch'

const notes = `
In addition to the value prop (intended to turn on the switch) this component accepts the onClick and className properties as well
`

storiesOf('Switch', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('default', () => (
    <Switch />
  ),
  { notes }
  )
  .add('on', () => (
    <Switch value />
  ),
  { notes }
  )
