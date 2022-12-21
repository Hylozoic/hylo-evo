import AccountSettingsTab from './AccountSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('AccountSettingsTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AccountSettingsTab
      currentUser={{}}
      updateUserSettings={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
