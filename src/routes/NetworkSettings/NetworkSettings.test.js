import NetworkSettings from './NetworkSettings'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<NetworkSettings />)
  expect(wrapper).toMatchSnapshot()
})
