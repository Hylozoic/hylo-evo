import Component from './Component'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<Component />)
  expect(wrapper).toMatchSnapshot()
})
