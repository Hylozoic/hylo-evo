import React from 'react'
import { storiesOf } from '@storybook/react'
import BadgedIcon from './component'

storiesOf('BadgedIcon', module)
  .add('basic',
    () => (
      <BadgedIcon name='EmailNotification' />
    ),
    { notes: 'Simple icon with badge desactivated' }
  )
  .add('with badge',
    () => (
      <BadgedIcon showBadge name='EmailNotification' />
    ),
    { notes: 'Icon with red badge' }
  )
  .add('green',
    () => (
      <BadgedIcon showBadge name='EmailNotification' green />
    ),
    { notes: 'Green icon with red badge' }
  )
