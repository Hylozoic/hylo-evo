import SendAnnouncementModal from './SendAnnouncementModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn()
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})
