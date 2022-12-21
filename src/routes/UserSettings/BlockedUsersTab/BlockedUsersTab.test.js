import BlockedUsersTab, { UnBlockUserControl } from './BlockedUsersTab'
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
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('BlockedUsersTab', () => {
  it('renders a list of UnBlockUserControls', () => {
    const blockedUsers = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ]
    const wrapper = shallow(<BlockedUsersTab blockedUsers={blockedUsers} />)
    expect(wrapper.find('UnBlockUserControl').length).toEqual(4)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('UnBlockUserControl', () => {
  it('renders correctly', () => {
    const blockedUser = {
      id: 'test-user-id',
      name: 'Test User'
    }
    const wrapper = shallow(<UnBlockUserControl blockedUser={blockedUser} />)
    expect(wrapper).toMatchSnapshot()
  })
})
