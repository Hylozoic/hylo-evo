import AccountSettingsTab from './AccountSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('AccountSettingsTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AccountSettingsTab
      currentUser={{}}
      updateUserSettings={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
