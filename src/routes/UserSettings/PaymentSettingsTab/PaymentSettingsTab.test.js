import PaymentSettingsTab from './PaymentSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('PaymentSettingsTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PaymentSettingsTab
      currentUser={{ hasFeature: () => true }}
      updateUserSettings={() => {}}
      queryParams={{}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
