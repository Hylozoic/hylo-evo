import React from 'react'
import { storiesOf } from '@storybook/react'
import Highlight from './Highlight'

storiesOf('Highlight', module)
  .add('show',
    () => (
      <Highlight
        term={[ 'CAT', 'DOG' ]}
        highlightClassName='highlight-span'
        componentClassName='highlight-component'
      >
        <div>Highlight</div>
      </Highlight>
    )
  )
