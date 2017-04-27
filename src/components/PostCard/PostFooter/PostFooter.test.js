import PostFooter from './PostFooter'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<PostFooter />)
  expect(wrapper).toMatchSnapshot()
})
