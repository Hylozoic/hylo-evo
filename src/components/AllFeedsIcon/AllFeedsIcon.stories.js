import React from 'react'
import { storiesOf } from '@storybook/react'
import AllFeedsIcon from './AllFeedsIcon'

storiesOf('AllFeedsIcon', module)
  .add('show', () => (
    <AllFeedsIcon />
  ),
  { notes: 'Simple "All Feeds" icon' }
  )
