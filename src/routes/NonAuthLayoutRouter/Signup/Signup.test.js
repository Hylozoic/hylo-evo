import React from 'react'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import Signup from './Signup'

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
    <Signup location={{ search: '' }} />
  )

  expect(screen.getByText('Enter your email to get started:')).toBeInTheDocument()
})
