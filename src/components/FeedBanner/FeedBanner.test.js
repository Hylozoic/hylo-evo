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

const group = {
  bannerUrl: 'banner.png',
  avatarUrl: 'avatar.png',
  name: 'Spacebase',
  location: 'space, duh'
}

it('renders with a group', () => {
  const node = mount(<FeedBanner
    group={group}
    isTesting
  />)
  expect(node).toMatchSnapshot()
})

it('renders for all groups', () => {
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
    const firstName = 'anybody'

    expect(postPromptString('project', { firstName })).toMatchSnapshot()
    expect(postPromptString('', { firstName })).toMatchSnapshot()
  })
})
