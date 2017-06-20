import CheckBox from './CheckBox'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<CheckBox
    checked
    onChange={() => {}}
    className='box' />)
  expect(wrapper).toMatchSnapshot()
})
