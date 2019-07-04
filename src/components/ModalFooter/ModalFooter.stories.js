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
    { notes: 'Ventana Modal de footer normal' }
  )
  .add('without option previous',
    () => (
      <div style={{ height: '10rem', backgroundColor: 'gray' }}>
        <ModalFooter
          continueText='next'
          showPrevious={false}
        />
      </div>
    ),
    { notes: 'Ventana Modal de footer sin opcion de previous' }
  )
