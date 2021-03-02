import React from 'react'
import PostCompletion from './PostCompletion'
import { shallow } from 'enzyme'

it('renders correctly if fulfilled', () => {
  const props = {
    isFulfilled: true,
    type: 'project'
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly if not fulfilled', () => {
  const props = {
    isFulfilled: false,
    type: 'resource'
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})
