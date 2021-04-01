import InviteSettingsTab from './InviteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const group = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<InviteSettingsTab
    group={group}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
  />)
  expect(wrapper).toMatchSnapshot()
})
