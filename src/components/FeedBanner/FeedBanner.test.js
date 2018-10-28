import React from 'react'
import FeedBanner, { postPromptString } from './FeedBanner'
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
  const node = mount(<FeedBanner
    community={community}
  />)
  expect(node).toMatchSnapshot()
})

it('renders for all communities', () => {
  const node = mount(<FeedBanner
    all
    currentUser={currentUser}
    currentUserHasMemberships
  />)
  expect(node).toMatchSnapshot()
})

it('matches the snapshot for an orphan user', () => {
  const node = mount(<FeedBanner
    all
    currentUser={currentUser}
    currentUserHasMemberships={false}
  />)
  expect(node).toMatchSnapshot()
})

describe('postPromptString', () => {
  it('renders a post prompt string', () => {
    const currentUser = {firstName: () => 'anybody'}

    expect(postPromptString('project', {currentUser})).toMatchSnapshot()
    expect(postPromptString('', {currentUser})).toMatchSnapshot()
  })
})