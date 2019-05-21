import DeleteSettingsTab from './DeleteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const community = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<DeleteSettingsTab
    community={community}
    deleteCommunity={() => {}}
  />)
  expect(wrapper).toMatchSnapshot()
})
