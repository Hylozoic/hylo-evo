import React from 'react'
import PostPrompt from './StreamBanner'
import { mount } from 'enzyme'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
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
  />)
  expect(node).toMatchSnapshot()
})
