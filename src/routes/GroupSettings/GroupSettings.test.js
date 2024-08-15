import GroupSettings from './GroupSettings'
import React from 'react'
import { AllTheProviders, render } from 'util/testing/reactTestingLibraryExtended'

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
