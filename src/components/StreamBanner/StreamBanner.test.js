import React from 'react'
import StreamBanner, { postPromptString } from './StreamBanner'
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
  const node = mount(<StreamBanner
    group={group}
    routeParams={{ view: 'stream' }}
    isTesting
  />)
  expect(node).toMatchSnapshot()
})

it('renders for all groups', () => {
  const node = mount(<StreamBanner
    all
    routeParams={{ view: 'stream' }}
    currentUser={currentUser}
    currentUserHasMemberships
  />)
  expect(node).toMatchSnapshot()
})

it('matches the snapshot for an orphan user', () => {
  const node = mount(<StreamBanner
    all
    routeParams={{ view: 'stream' }}
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
