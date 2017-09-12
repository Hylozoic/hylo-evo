import CommunitySettingsTab, { CommunityControl } from './CommunitySettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('CommunitySettingsTab', () => {
  it('renders a list of CommunityControls', () => {
    const memberships = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4}
    ]
    const wrapper = shallow(<CommunitySettingsTab memberships={memberships} />)
    expect(wrapper.find('CommunityControl').length).toEqual(4)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityControl', () => {
  it('renders correctly', () => {
    const membership = {
      settings: {
        sendEmail: false,
        sendPushNotifications: true
      },
      community: {
        name: 'Foomunity'
      }
    }
    const wrapper = shallow(<CommunityControl membership={membership} />)
    expect(wrapper.find('Link').length).toEqual(2)
    expect(wrapper.find('Link').get(1).props.children).toEqual(membership.community.name)
    expect(wrapper).toMatchSnapshot()
  })
})
