import PaymentSettingsTab from './PaymentSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('PaymentSettingsTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PaymentSettingsTab
      currentUser={{ hasFeature: () => true }}
      updateUserSettings={() => {}}
      queryParams={{}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
