import Members, { twoByTwo } from './Members'
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
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

it('does something', () => {
  const wrapper = shallow(
    <Members
      group={{ id: 1 }}
      members={[
        { id: '1', groupRoles: [], moderatedGroupMemberships: [], name: 'You' },
        { id: '2', groupRoles: [], moderatedGroupMemberships: [], name: 'Me' },
        { id: '3', groupRoles: [], moderatedGroupMemberships: [], name: 'Everyone' }
      ]}
    />)
  expect(wrapper.find('Connect(Member)')).toHaveLength(3)
})

describe('twoByTwo', () => {
  it('works', () => {
    expect(twoByTwo([1, 2, 3, 4, 5, 6, 7])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7]
    ])
  })
})
