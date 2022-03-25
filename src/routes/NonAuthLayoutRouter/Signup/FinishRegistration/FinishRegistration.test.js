import React from 'react'
import FinishRegistration from './FinishRegistration'
import { render, screen } from 'util/reactTestingLibraryExtended'
import userEvent from '@testing-library/user-event'

const currentUser = { name: 'Smiley', email: 'test@wheee.com' }

it('renders correctly', () => {
  render(
    <FinishRegistration currentUser={currentUser} />,
  )

  expect(screen.getByText('One more step!')).toBeInTheDocument()
})

it('renders correctly with an API error', () => {
  render(
    <FinishRegistration graphlResponseError='some error' currentUser={currentUser} />
  )

  expect(screen.getByText('some error')).toBeInTheDocument()
})

it('renders correctly with an internal error', async () => {
  const user = userEvent.setup()

  render(
    <FinishRegistration currentUser={currentUser} />
  )

  await user.type(screen.getByLabelText('password'), '012345678')
  await user.type(screen.getByLabelText('passwordConfirmation'), '012345671')

  expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
})
