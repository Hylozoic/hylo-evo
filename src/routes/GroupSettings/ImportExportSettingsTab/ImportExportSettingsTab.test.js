import ImportExportSettingsTab from './ImportExportSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

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
