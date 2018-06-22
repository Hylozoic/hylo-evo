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

it('toggles allowCommunityInvites and calls the function to make the request on the server', () => {
  const community = {
    id: 1,
    name: 'Hylo'
  }
  const allMembersCanInvite = false
  const allowCommunityInvites = jest.fn(() => new Promise(() => {}))

  const wrapper = shallow(<InviteSettingsTab
    community={community}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
    allMembersCanInvite={allMembersCanInvite}
    allowCommunityInvites={allowCommunityInvites}
    />)
  wrapper.instance().toggleSwitch()
  expect(allowCommunityInvites).toBeCalled()
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})

it('handles allowCommunityInvites error', () => {
  const community = {
    id: 1,
    name: 'Hylo'
  }
  const allMembersCanInvite = false
  const allowCommunityInvites = jest.fn(() => Promise.resolve({error: 'some error'}))

  const wrapper = shallow(<InviteSettingsTab
    community={community}
    regenerateAccessCode={() => {}}
    inviteLink='http://www.hylo.com/c/hylo/join/lalala'
    allMembersCanInvite={allMembersCanInvite}
    allowCommunityInvites={allowCommunityInvites}
    />)
  wrapper.instance().toggleSwitch()
  expect(allowCommunityInvites).toBeCalled()
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})

it('changes state when nextProps has a new value for community.allowCommunityInvites', () => {
  const community = {
    allowCommunityInvites: false
  }

  const nextCommunity = {
    allowCommunityInvites: true
  }

  const wrapper = shallow(<InviteSettingsTab community={community} />)
  wrapper.setProps({community: nextCommunity})
  expect(wrapper.instance().state.allMembersCanInvite).toBeTruthy()
})
