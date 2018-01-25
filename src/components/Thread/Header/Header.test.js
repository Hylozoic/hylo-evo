import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'

it('should match the latest snapshot', () => {
  const others = ['one', 'two', 'three']
  const props = {
    others
  }
  const wrapper = shallow(<Header {...props} />)
  expect(wrapper).toMatchSnapshot()
})
