import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import DropdownButton from './DropdownButton'

storiesOf('DropdownButton', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        <br />
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('show', () => (
    <DropdownButton
      label='DropdownButton'
      onChoose={() => {}}
      choices={
        [
          {
            label: 'item1',
            value: 1
          },
          {
            label: 'item2',
            value: 2
          }
        ]
      }
    />
  ),
  { notes: 'A dropdown menu, but in this cases is a button and not a label' }
  )
