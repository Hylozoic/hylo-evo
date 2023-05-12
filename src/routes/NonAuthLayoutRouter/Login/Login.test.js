import React from 'react'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import Login from './Login'

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
it('renders correctly', () => {
  render(
    <Login location={{ search: '' }} />
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
