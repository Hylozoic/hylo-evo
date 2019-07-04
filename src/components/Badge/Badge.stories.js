import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Badge from 'components/Badge'

const props = {
  number: 7,
  expanded: true,
  onClick: () => {}
}

storiesOf('Badge', module)
  .addDecorator(story => (
    <MemoryRouter>{story()}</MemoryRouter>
  ))
  .add('Basic', () =>
    <Badge {...props} />
  )
