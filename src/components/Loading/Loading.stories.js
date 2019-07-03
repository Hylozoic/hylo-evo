import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Loading from 'components/Loading'

storiesOf('Loading', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        <br />
        {story()}
      </>
    </MemoryRouter>
  ),
  { notes: 'A loading icon' }
  )
  .add('Full screen', () =>
    <Loading type='fullscreen' />
  )
  .add('Top', () =>
    <Loading type='top' />
  )
  .add('Bottom', () =>
    <Loading type='bottom' />
  )
  .add('Inline', () =>
    <Loading type='inline' />
  )
