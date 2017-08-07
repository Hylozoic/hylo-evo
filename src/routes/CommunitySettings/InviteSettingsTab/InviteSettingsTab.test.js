import InviteSettingsTab from './InviteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<InviteSettingsTab />)
  expect(wrapper).toMatchSnapshot()
})
