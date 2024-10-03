import
NotificationSettingsTab,
{ MessageSettingsRow, AllGroupsSettingsRow, MembershipSettingsRow, SettingsRow, SettingsIcon }
  from './NotificationSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('NotificationSettingsTab', () => {
  const currentUser = {
    hasDevice: true,
    settings: {
      digestFrequency: 'daily',
      dmNotifications: 'none',
      commentNotifications: 'email',
      postNotifications: 'important'
    }
  }

  it('renders correctly', () => {
    const wrapper = shallow(<NotificationSettingsTab
      currentUser={currentUser}
      updateUserSettings={() => {}}
      memberships={[{ id: 1 }, { id: 2 }]} />)
    expect(wrapper).toMatchSnapshot()
  })

  it("hides mobile options if user doesn't have device", () => {
    const wrapper = shallow(<NotificationSettingsTab memberships={[]} currentUser={{
      ...currentUser,
      hasDevice: false
    }} />)
    expect(wrapper.find('Select').at(1).prop('options')).toHaveLength(3)
  })

  it("does the right thing with 'both' if user doesn't have device", () => {
    const wrapper = shallow(<NotificationSettingsTab memberships={[]} currentUser={{
      ...currentUser,
      settings: {
        ...currentUser.settings,
        dmNotifications: 'both'
      },
      hasDevice: false
    }} />)

    expect(wrapper.find('Select').at(2).prop('selected')).toEqual('email')
  })

  describe('updateMessageSettings', () => {
    it('calls updateUserSettings', () => {
      const props = {
        messageSettings: {
          sendEmail: true
        },
        updateUserSettings: jest.fn(),
        memberships: []
      }
      const wrapper = shallow(<NotificationSettingsTab {...props} />)
      const instance = wrapper.instance()
      instance.updateMessageSettings({ sendPushNotifications: true })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'both' } })
      instance.updateMessageSettings({ sendEmail: false })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'none' } })
      instance.updateMessageSettings({})
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'email' } })
      instance.updateMessageSettings({ sendEmail: false, sendPushNotifications: true })
      expect(props.updateUserSettings).toHaveBeenCalledWith({ settings: { dmNotifications: 'push' } })
    })
  })

  describe('updateAllGroups', () => {
    it('calls updateAllMemberships', () => {
      const props = {
        messageSettings: {
          sendEmail: true
        },
        updateAllMemberships: jest.fn(),
        memberships: [{
          group: {
            id: 1
          }
        }, {
          group: {
            id: 2
          }
        }]
      }
      const wrapper = shallow(<NotificationSettingsTab {...props} />)
      const instance = wrapper.instance()
      instance.updateAllGroups({ sendPushNotifications: true })
      expect(props.updateAllMemberships).toHaveBeenCalledWith([1, 2], { sendPushNotifications: true })
    })
  })
})

describe('MessageSettingsRow', () => {
  const props = {
    settings: { sendEmail: true },
    updateMessageSettings: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<MessageSettingsRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('AllGroupsSettingsRow', () => {
  const props = {
    settings: { sendEmail: true },
    updateAllGroups: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<AllGroupsSettingsRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('MembershipSettingsRow', () => {
  const props = {
    membership: {
      settings: { sendEmail: true },
      group: {
        name: 'Foomunity',
        avatarUrl: 'foo.png'
      }
    },
    updateMembershipSettings: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<MembershipSettingsRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SettingsRow', () => {
  const props = {
    settings: { sendEmail: true },
    updateMembershipSettings: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<SettingsRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SettingsIcon', () => {
  const props = {
    settingKey: 'sendEmail',
    name: 'EmailNotification',
    settings: { sendEmail: true },
    update: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<SettingsIcon {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
