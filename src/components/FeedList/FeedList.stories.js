import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import FeedList from './FeedList'

storiesOf('FeedList', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        <br />
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('show', () => (
    <FeedList
      posts={
        [
          { id: 1 },
          { id: 2 }
        ]
      }
    />
  ))
