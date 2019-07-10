import React from 'react'
import { storiesOf } from '@storybook/react'
import Badge from 'components/Badge'

const props = {
  number: 7,
  expanded: true,
  onClick: () => {}
}

const notes = `
Red badge intended to display a number
`

storiesOf('Badge', module)
  .add('Basic',
    () => (
      <Badge {...props} />
    ),
    { notes }
  )
