import SendAnnouncementModal from './SendAnnouncementModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly with one community', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    communityMembersCount: 100,
    myModeratedCommunities: [{id: 1}],
    communities: [{id: 1}]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with multiple communities', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    communityMembersCount: 100,
    myModeratedCommunities: [{id: 1}, {id: 2}],
    communities: [{id: 1}, {id: 2}]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with multiple communities, where the current user is not always a moderator', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    communityMembersCount: 100,
    myModeratedCommunities: [{id: 1}],
    communities: [{id: 1}, {id: 2}]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})
