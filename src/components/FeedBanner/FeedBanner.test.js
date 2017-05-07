import React from 'react'
import FeedBanner from './FeedBanner'
import { mount } from 'enzyme'

const currentUser = {
  avatarUrl: 'me.png',
  firstName: () => 'Bob',
  memberships: {
    count: () => 18
  }
}

const community = {
  bannerUrl: 'banner.png',
  avatarUrl: 'avatar.png',
  name: 'Spacebase',
  location: 'space, duh'
}

it('renders with a community', () => {
  const node = mount(<FeedBanner community={community} />)
  expect(node).toMatchSnapshot()
})

it('renders for all communities', () => {
  const node = mount(<FeedBanner all currentUser={currentUser} />)
  expect(node).toMatchSnapshot()
})
