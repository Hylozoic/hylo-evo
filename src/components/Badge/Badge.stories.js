import React from 'react'
import { storiesOf } from '@storybook/react'
import Badge from 'components/Badge'

const props = {
  number: 7,
  expanded: true,
  onClick: () => {}
}

storiesOf('Badge', module)
  .add('Basic', () =>
    <Badge {...props} />
  )
