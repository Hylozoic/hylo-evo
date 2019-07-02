import React from 'react'
import { storiesOf } from '@storybook/react'
import Highlight from './Highlight'

storiesOf('Highlight', module)
  .add('show', () => (
    <Highlight 
      children={<div>Highlight</div>}
      term={['CAT','DOG']}
      highlightClassName='highlight-span'
      componentClassName='highlight-component'
    />
))