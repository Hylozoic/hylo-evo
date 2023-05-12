import React from 'react'
import { shallow } from 'enzyme'
import TopicSupportComingSoon from './index'

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

it('renders', () => {
  const wrapper = shallow(<TopicSupportComingSoon />)
  expect(wrapper).toMatchSnapshot()
})
