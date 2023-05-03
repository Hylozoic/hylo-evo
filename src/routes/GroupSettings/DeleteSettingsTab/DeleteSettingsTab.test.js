import DeleteSettingsTab from './DeleteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
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

  const wrapper = shallow(<DeleteSettingsTab
    group={group}
    deleteGroup={() => {}}
  />)
  expect(wrapper).toMatchSnapshot()
})
