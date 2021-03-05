import ManageInvitesTab from './ManageInvitesTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('ManageInvitesTab', () => {
  it('renders a list of pending join requests', () => {
    const props = {
      canceledJoinRequests: [],
      pendingJoinRequests: [
        { id: "1", group: { id: 1, name: 'group1', avatarUrl: null } },
        { id: "2", group: { id: 2, name: 'group2', avatarUrl: null } },
      ],
      rejectedJoinRequests: [],
      cancelJoinRequest: () => {},
      fetchJoinRequests: jest.fn(() => Promise.resolve({ me: {} }))
    }

    const wrapper = shallow(<ManageInvitesTab {...props } />)
    expect(wrapper.find('JoinRequest').length).toEqual(2)
    expect(wrapper).toMatchSnapshot()
  })
})
