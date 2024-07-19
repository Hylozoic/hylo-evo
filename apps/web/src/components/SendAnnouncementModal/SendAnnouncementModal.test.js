import SendAnnouncementModal from './SendAnnouncementModal'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

it('renders correctly with one group', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    groupMembersCount: 100,
    myModeratedGroups: [{ id: 1 }],
    groups: [{ id: 1 }]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with multiple groups', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    groupMembersCount: 100,
    myModeratedGroups: [{ id: 1 }, { id: 2 }],
    groups: [{ id: 1 }, { id: 2 }]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with multiple groups, where the current user is not always a moderator', () => {
  const props = {
    closeModal: jest.fn(),
    save: jest.fn(),
    groupMembersCount: 100,
    myModeratedGroups: [{ id: 1 }],
    groups: [{ id: 1 }, { id: 2 }]
  }
  const wrapper = shallow(<SendAnnouncementModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})
