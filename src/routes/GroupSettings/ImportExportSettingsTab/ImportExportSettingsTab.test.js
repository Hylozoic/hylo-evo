import ImportExportSettingsTab from './ImportExportSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const group = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<ImportExportSettingsTab
    group={group}
    upload={() => {}}
  />)
  expect(wrapper).toMatchSnapshot()
})
