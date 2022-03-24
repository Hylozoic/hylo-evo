import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import Login from './Login'

function testProvider () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)
  return AllTheProviders(store)
}

function createRootContainer () {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'root')
  return document.body.appendChild(rootElement)
}

it('renders correctly', () => {
  const { getByText, queryByText } = render(
    <Login location={{ search: '' }} />,
    { container: createRootContainer() },
    testProvider()
  )
  expect(queryByText('View in Hylo app')).not.toBeInTheDocument()
  expect(getByText('Sign in to Hylo')).toBeInTheDocument()
})

it('renders correctly with mobile redirect', () => {
  const url = 'some.url'
  const mobileRedirectSpy = jest.spyOn(require('util/mobile'), 'mobileRedirect')
    .mockImplementation(() => 'mobile/app/url')

  const { getByText } = render(
    <Login downloadAppUrl={url} location={{ search: '' }} />,
    { container: createRootContainer() },
    testProvider()
  )
  expect(getByText('View in Hylo app')).toBeInTheDocument()
  mobileRedirectSpy.mockRestore()
})
