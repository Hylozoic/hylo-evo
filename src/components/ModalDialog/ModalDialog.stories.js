import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import ModalDialog from './ModalDialog'

storiesOf('ModalDialog', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('show', () => (
    <ModalDialog />
  ),
  { notes: 'A modal dialog whit custom title, background image, notification format, cancel and submit button. Also has a view without title' }
  )
  .add('with custom title', () => (
    <ModalDialog modalTitle='An Interesting Title' />
  ))
  .add('with background image', () => (
    <ModalDialog useNotificationFormat backgroundImage='holochain-logo-transparent-small.png' />
  ))
  .add('notification format', () => (
    <ModalDialog useNotificationFormat />
  ))
  .add('without cancel button', () => (
    <ModalDialog showCancelButton={false} />
  ))
  .add('without submit button', () => (
    <ModalDialog showSubmitButton={false} />
  ))
  .add('without title', () => (
    <ModalDialog modalTitle='An Interesting Title That Shall Not Be Seen' showModalTitle={false} />
  ))
  .add('with children', () => (
    <ModalDialog modalTitle='An Interesting Title That Shall Not Be Seen' showModalTitle={false} >
      <div>
        Some random content
      </div>
    </ModalDialog>
  ))
