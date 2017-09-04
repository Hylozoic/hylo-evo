import PasswordSettingsTab from './PasswordSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('PasswordSettingsTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PasswordSettingsTab
      currentUser={{}}
      updateUserSettings={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
