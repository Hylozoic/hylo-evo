import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Dropdown from './Dropdown'

const notes = ''

storiesOf('Dropdown', module)
  .addDecorator(story => (
    <MemoryRouter>
                <>
                  <br />
                  {story()}
                </>
    </MemoryRouter>
  ))
  .add('show', () => (
    <Dropdown
      toggleChildren='Dropdown'
      items={
        [
          {
            onClick: () => {},
            label: 'item1',
            icon: 'icon'
          },
          {
            onClick: () => {},
            label: 'item2',
            icon: 'icon'
          },
          {
            onClick: () => {},
            label: 'item3',
            icon: 'icon'
          }
        ]
      }
    />
  ),
  { notes: 'A dropdown menu with a optional tirangular pointer and 3 items' }
  )
  .add('triangular pointer', () => (
    <Dropdown
      toggleChildren='Dropdown'
      items={
        [
          {
            onClick: () => {},
            label: 'item1',
            icon: 'icon'
          },
          {
            onClick: () => {},
            label: 'item2',
            icon: 'icon'
          }
        ]
      }
      triangle
    />
  ),
  { notes }
  )
