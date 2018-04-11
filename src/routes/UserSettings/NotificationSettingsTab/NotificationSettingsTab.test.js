import NotificationSettingsTab from './NotificationSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('NotificationSettingsTab', () => {
  const currentUser = {
    hasDevice: true,
    settings: {
      digestFrequency: 'daily',
      dmNotifications: 'none',
      commentNotifications: 'email'
    }
  }

  it('renders correctly', () => {
    const wrapper = shallow(<NotificationSettingsTab
      currentUser={currentUser}
      updateUserSettings={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it("hides mobile options if user doesn't have device", () => {
    const wrapper = shallow(<NotificationSettingsTab currentUser={{
      ...currentUser,
      hasDevice: false
    }} />)
    expect(wrapper.find('Select').at(1).prop('options')).toHaveLength(2)
  })

  it("does the right thing with 'both' if user doesn't have device", () => {
    const wrapper = shallow(<NotificationSettingsTab currentUser={{
      ...currentUser,
      settings: {
        ...currentUser.settings,
        dmNotifications: 'both'
      },
      hasDevice: false
    }} />)

    expect(wrapper.find('Select').at(1).prop('selected')).toEqual('email')
  })
})
