import NotificationSettings from './NotificationSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe('NotificationSettings', () => {
  const currentUser = {
    hasDevice: true,
    settings: {
      digestFrequency: 'daily',
      dmNotifications: 'none',
      commentNotifications: 'email'
    }
  }

  it('renders correctly', () => {
    const wrapper = shallow(<NotificationSettings
      currentUser={currentUser}
      updateUserSettings={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it("hides mobile options if user doesn't have device", () => {
    const wrapper = shallow(<NotificationSettings currentUser={{
      ...currentUser,
      hasDevice: false
    }} />)
    expect(wrapper.find('Select').at(1).prop('options')).toHaveLength(2)
  })
})
