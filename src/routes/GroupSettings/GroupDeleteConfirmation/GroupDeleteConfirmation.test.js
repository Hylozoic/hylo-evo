import GroupDeleteConfirmation from './GroupDeleteConfirmation'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<GroupDeleteConfirmation />)
  expect(wrapper).toMatchSnapshot()
})
