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

it('toggles allowGroupInvites and calls the function to make the request on the server', () => {
  const group = {
    id: 1,
    name: 'Hylo'
  }
  const allMembersCanInvite = false
  const allowGroupInvites = jest.fn(() => new Promise(() => {}))

  const wrapper = shallow(<InviteSettingsTab
    group={group}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
    allMembersCanInvite={allMembersCanInvite}
    allowGroupInvites={allowGroupInvites}
  />)
  wrapper.instance().toggleAllMembersCanInvite()
  expect(allowGroupInvites).toBeCalled()
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})

it('handles allowGroupInvites error', () => {
  const group = {
    id: 1,
    name: 'Hylo'
  }
  const allMembersCanInvite = false
  const allowGroupInvites = jest.fn(() => Promise.resolve({ error: 'some error' }))

  const wrapper = shallow(<InviteSettingsTab
    group={group}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
    allMembersCanInvite={allMembersCanInvite}
    allowGroupInvites={allowGroupInvites}
  />)
  wrapper.instance().toggleAllMembersCanInvite()
  expect(allowGroupInvites).toBeCalled()
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})

it('changes state when nextProps has a new value for group.allowGroupInvites', () => {
  const group = {
    allowGroupInvites: false
  }

  const nextGroup = {
    allowGroupInvites: true
  }

  const wrapper = shallow(<InviteSettingsTab group={group} />)
  wrapper.setProps({ group: nextGroup })
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})
