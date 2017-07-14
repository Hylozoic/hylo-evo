import NetworkCommunities from './NetworkCommunities'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<NetworkCommunities />)
  expect(wrapper).toMatchSnapshot()
})
