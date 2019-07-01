import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import FeedBanner from './FeedBanner'

storiesOf('FeedBanner', module)
  .addDecorator(story => (
    <MemoryRouter>
      <>
        <br />
        {story()}
      </>
    </MemoryRouter>
  ))
  .add('for all communities', () => (
    <FeedBanner all />
  ))
  .add('community', () => (
    <FeedBanner community />
  ))
  .add('with user membership', () => (
    <FeedBanner
      currentUser={{
        firstName: () => 'Philip',
        avatarUrl: 'https://avatars3.githubusercontent.com/u/5264862?s=40&v=4'
      }}
      community
      currentUserHasMemberships
    />
  ))
