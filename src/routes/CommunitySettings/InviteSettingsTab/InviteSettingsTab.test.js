import InviteSettingsTab from './InviteSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const community = {
    id: 1,
    name: 'Hylo'
  }

  const wrapper = shallow(<InviteSettingsTab
    community={community}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
    />)
  expect(wrapper).toMatchSnapshot()
})
