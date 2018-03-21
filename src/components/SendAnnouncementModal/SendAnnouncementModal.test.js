import SendAnnouncementModal from './SendAnnouncementModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
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
