import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Button from 'components/Button'

const props = {
  label: 'Log in',
  hover: true,
  active: true,
  narrow: true,
  small: true,
  children: null,
  onClick: () => {},
  disabled: false
}

storiesOf('Button', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Normal', () =>
    <Button {...props} />,
  {
    notes: 'Button in normal mode. Clickable'
  })
  .add('Disabled', () =>
    <Button {...props} active={false} />,
  {
    notes: 'Button in disabled mode. Not clickable'
  })
