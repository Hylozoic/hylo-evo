import React from 'react'
import { shallow } from 'enzyme'
import PostCard from './component'

it('renders welcome message', () => {
  const wrapper = shallow(<PostCard />)
  expect(wrapper).toEqual(true)
})
