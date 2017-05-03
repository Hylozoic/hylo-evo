import MessagesDropdown from './MessagesDropdown'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<MessagesDropdown />)
  expect(wrapper).toMatchSnapshot()
})
