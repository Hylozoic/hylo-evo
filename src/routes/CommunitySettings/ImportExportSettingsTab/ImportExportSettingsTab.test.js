import ImportExportSettingsTab from './ImportExportSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const community = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<ImportExportSettingsTab
    community={community}
    upload={() => {}}
  />)
  expect(wrapper).toMatchSnapshot()
})
