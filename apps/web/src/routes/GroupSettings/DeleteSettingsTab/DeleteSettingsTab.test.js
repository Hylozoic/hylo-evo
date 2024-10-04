import DeleteSettingsTab from './DeleteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const group = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<DeleteSettingsTab
    group={group}
    deleteGroup={() => {}}
  />)
  expect(wrapper).toMatchSnapshot()
})
