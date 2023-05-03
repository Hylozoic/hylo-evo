import Consent from './Consent'
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
    <Consent location={{ search: '?name=CoolApp' }} appName='CoolApp' />
  )

  expect(screen.getByText('{{appName}} wants access to your Hylo account')).toBeInTheDocument()
})
