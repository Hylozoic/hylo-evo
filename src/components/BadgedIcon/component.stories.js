import React from 'react'
import { storiesOf } from '@storybook/react'
import BadgedIcon from './component'

storiesOf('BadgedIcon', module)
  .add('show',
    () => (
      <BadgedIcon />
    ),
    { notes: 'Simple "All Feeds" icon' }
  )
