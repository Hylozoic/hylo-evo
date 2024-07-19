import GroupSettings from './GroupSettings'
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

it('renders correctly with no group', () => {
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders a redirect if you can not moderate', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()}
    group={group} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with a group', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()} group={group} canModerate />)
  expect(wrapper).toMatchSnapshot()
})
