import React from 'react'
import { storiesOf } from '@storybook/react'
import Highlight from './Highlight'

const highlightClassName = 'highlight-span'
const componentClassName = 'highlight-component'
const terms = ['cat', 'dog']

const markup = (
  <div className='cat'>
    <span>one cat and one dog</span>
    <span className='dog'>
      <ul>another cat and another cat</ul>
    </span>
  </div>
)

storiesOf('Highlight', module)
  .add('Usage with react tree',
    () => (
      <Highlight
        className={componentClassName}
        terms={terms}
        highlightClassName={highlightClassName}
      >
        {markup}
      </Highlight>
    )
  )
