import CreateGroup from './CreateGroup'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<CreateGroup />)
  expect(wrapper).toMatchSnapshot()
})
