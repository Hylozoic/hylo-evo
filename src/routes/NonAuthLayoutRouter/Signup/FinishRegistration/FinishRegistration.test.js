import React from 'react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { graphql } from 'msw'
import orm from 'store/models'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'
import { AllTheProviders, render, screen } from 'util/reactTestingLibraryExtended'
import FinishRegistration from './FinishRegistration'

const mockGraphqlServer = setupServer()
mockGraphqlServer.listen()

function currentUserProvider () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }

  extractModelsFromAction({
    payload: {
      data: {
        me: {
          id: '1',
          hasRegistered: false,
          emailValidated: true,
          settings: {
            signupInProgress: true
          }
        }
      }
    },
    meta: {
      extractModel: 'Me'
    }
  }, ormSession)

  return AllTheProviders(reduxState)
}

it('renders correctly', () => {
  render(
    <FinishRegistration />,
    { wrapper: currentUserProvider() }
  )

  expect(screen.getByText('One more step!')).toBeInTheDocument()
})

it('renders password error if it not confirmed', async () => {
  const user = userEvent.setup()

  render(
    <FinishRegistration />,
    { wrapper: currentUserProvider() }
  )

  await user.type(screen.getByLabelText('name'), 'Smiley Person')
  await user.type(screen.getByLabelText('password'), '012345678')
  await user.type(screen.getByLabelText('passwordConfirmation'), '012345671')
  await user.click(screen.getByText('Jump in to Hylo!'))

  expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
})

it('does not submit if name is not present, even if password is valid', async () => {
  const user = userEvent.setup()
  const registerCalled = jest.fn()

  mockGraphqlServer.resetHandlers(
    graphql.mutation('Register', (req, res, ctx) => {
      registerCalled(req.variables)

      // this return is required, results are ignored
      return res(ctx.data({}))
    })
  )

  render(
    <FinishRegistration />,
    { wrapper: currentUserProvider() }
  )

  await user.type(screen.getByLabelText('password'), '012345678')
  await user.type(screen.getByLabelText('passwordConfirmation'), '012345678')
  await user.click(screen.getByText('Jump in to Hylo!'))

  expect(registerCalled).not.toHaveBeenCalled()
})

it('registers user if a name and valid password provided', async () => {
  const user = userEvent.setup()
  const registerCalled = jest.fn()

  mockGraphqlServer.resetHandlers(
    graphql.mutation('Register', (req, res, ctx) => {
      registerCalled(req.variables)

      // this return is required, results are ignored
      return res(ctx.data({}))
    })
  )

  render(
    <FinishRegistration />,
    { wrapper: currentUserProvider() }
  )

  await user.type(screen.getByLabelText('name'), 'Smiley Person')
  await user.type(screen.getByLabelText('password'), '012345678')
  await user.type(screen.getByLabelText('passwordConfirmation'), '012345678')
  await user.click(screen.getByText('Jump in to Hylo!'))

  expect(registerCalled).toHaveBeenCalledWith({ name: 'Smiley Person', password: '012345678' })
})
