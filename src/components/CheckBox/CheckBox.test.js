import CheckBox from './CheckBox'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<CheckBox />)
  expect(wrapper).toMatchSnapshot()
})
