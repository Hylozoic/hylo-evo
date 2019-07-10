import React from 'react'
import { storiesOf } from '@storybook/react'
import ModalFooter from './ModalFooter'

storiesOf('ModalFooter', module)
  .add('normal',
    () => (
      <div style={{ height: '10rem', backgroundColor: 'gray' }}>
        <ModalFooter continueText='next' />
      </div>
    ),
    { notes: 'default footer' }
  )
  .add('without previous option',
    () => (
      <div style={{ height: '10rem', backgroundColor: 'gray' }}>
        <ModalFooter
          continueText='next'
          showPrevious={false}
        />
      </div>
    ),
    { notes: 'without previous option' }
  )
