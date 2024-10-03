import React from 'react'
import GroupBanner, { PostPrompt } from './GroupBanner'
import { BrowserRouter } from 'react-router-dom'
import { shallow } from 'enzyme'

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
  const node = shallow(<BrowserRouter><GroupBanner
    group={group}
    routeParams={{ view: 'stream', slug: 'foo' }}
    isTesting
  /></BrowserRouter>)
  expect(node).toMatchSnapshot()
})

it('renders for all groups', () => {
  const node = shallow(<BrowserRouter><GroupBanner
    context='all'
    routeParams={{ view: 'stream' }}
    currentUser={currentUser}
    currentUserHasMemberships
  /></BrowserRouter>)
  expect(node).toMatchSnapshot()
})

it('matches the snapshot for an orphan user', () => {
  const node = shallow(<BrowserRouter><GroupBanner
    context='all'
    routeParams={{ view: 'stream', slug: 'foo' }}
    currentUser={currentUser}
    currentUserHasMemberships={false}
  /></BrowserRouter>)
  expect(node).toMatchSnapshot()
})

describe('PostPrompt', () => {
  it('renders a post prompt', () => {
    const firstName = 'Arturo'
    const wrapper = shallow(<BrowserRouter><PostPrompt firstName={firstName} type='project' /></BrowserRouter>)

    expect(wrapper).toMatchSnapshot()
  })
})
