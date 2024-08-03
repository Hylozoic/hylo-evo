import GroupSettings from './GroupSettings'
import React from 'react'
import { AllTheProviders, render } from 'util/testing/reactTestingLibraryExtended'

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
  const { asFragment } = render(<GroupSettings fetchGroupSettings={jest.fn()} />, { wrapper: AllTheProviders() })
  expect(asFragment()).toMatchSnapshot()
})

it('renders a redirect if you can not moderate', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const { asFragment } = render(<GroupSettings fetchGroupSettings={jest.fn()} group={group} />, { wrapper: AllTheProviders() })
  expect(asFragment()).toMatchSnapshot()
})

it('renders correctly with a group', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const { asFragment } = render(<GroupSettings fetchGroupSettings={jest.fn()} group={group} />, { wrapper: AllTheProviders() })
  expect(asFragment()).toMatchSnapshot()
})
