import CommunitySettings from './CommunitySettings'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly with no community', () => {
  const wrapper = shallow(<CommunitySettings />)
  expect(wrapper).toMatchSnapshot()
})

it('renders a redirect if you can not moderate', () => {
  const community = {id: 1, slug: 'foo', name: 'Foomunity'}
  const wrapper = shallow(<CommunitySettings
    community={community} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with a community', () => {
  const community = {id: 1, slug: 'foo', name: 'Foomunity'}
  const wrapper = shallow(<CommunitySettings community={community} canModerate />)
  expect(wrapper).toMatchSnapshot()
})
