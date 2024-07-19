import Login from './Login'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
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

it('renders correctly', () => {
  render(
    <Login location={{ search: '' }} match={{ params: { uid: 'uid' } }} />
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
