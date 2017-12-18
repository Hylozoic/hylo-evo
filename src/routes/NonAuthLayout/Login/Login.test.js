import Login from './Login'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<Login />)
  expect(wrapper).toMatchSnapshot()
})
