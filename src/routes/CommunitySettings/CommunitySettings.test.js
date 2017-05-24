import CommunitySettings from './CommunitySettings'
import { shallow } from 'enzyme'
import React from 'react'

it.skip('does something', () => {
  const wrapper = shallow(<CommunitySettings />)
  expect(wrapper).toMatchSnapshot()
})
