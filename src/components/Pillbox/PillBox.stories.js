import React from 'react'
import { storiesOf } from '@storybook/react'
import PillBox from './Pillbox'

storiesOf('Pillbox', module)
  .add('show', () => (
    <PillBox
      pills={[ { id: 1 }, { id: 2 } ]}
    />
  ))
