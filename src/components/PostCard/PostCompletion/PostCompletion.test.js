import React from 'react'
import PostCompletion from './PostCompletion'
import { shallow } from 'enzyme'

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

it('renders correctly if fulfilled', () => {
  const props = {
    isFulfilled: true,
    type: 'project'
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly if not fulfilled', () => {
  const props = {
    isFulfilled: false,
    type: 'resource'
  }
  const wrapper = shallow(<PostCompletion {...props} />)
  expect(wrapper).toMatchSnapshot()
})
