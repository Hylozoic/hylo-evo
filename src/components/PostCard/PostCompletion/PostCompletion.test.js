import React from 'react'
import PostCompletion from './PostCompletion'
import { shallow } from 'enzyme'

it('renders correctly if fulfilled', () => {
  const props = {
    isFulfilled: true
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly if not fulfilled', () => {
  const props = {
    isFulfilled: false
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})
