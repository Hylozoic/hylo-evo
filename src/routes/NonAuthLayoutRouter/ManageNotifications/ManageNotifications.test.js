import React from 'react'
import orm from 'store/models'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import { act } from '@testing-library/react'
import ManageNotifications from './ManageNotifications'

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

jest.mock('hooks/useRouter', () => () => {
  return {
    query: {
      name: 'Philharmonic'
    }
  }
})

jest.mock('store/middleware/apiMiddleware', () => (req) => {
  return store => next => action => {
    return Promise.resolve({ ...action, payload: Promise.resolve({ commentNotifications: 'email', dmNotifications: 'push', digestFrequency: 'daily', allGroupNotifications: 'both' }) })
  }
})

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  return AllTheProviders(reduxState)
}

describe('ManageNotifications', () => {
  it('renders correctly', async () => {
    await act(async () => {
      render(
        <ManageNotifications match={{ params: { cheese: 1 } }} location={{ search: '?name=Philharmonic&token=hjkhkjhkjh' }} />,
        { wrapper: testProviders() }
      )
      expect(screen.getByText('Hi {{userName}}')).toBeInTheDocument()
    })
  })
})
