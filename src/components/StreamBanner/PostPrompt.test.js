import React from 'react'
import PostPrompt from './StreamBanner'
import { mount } from 'enzyme'

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

it('renders with a post prompt', () => {
  const node = mount(<PostPrompt
    firstName='Arturo'
    routeParams={{ view: 'stream' }}
  />)
  expect(node).toMatchSnapshot()
})
