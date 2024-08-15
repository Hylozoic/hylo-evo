import React from 'react'
import { shallow } from 'enzyme'
import { graphql } from 'msw'
import userEvent from '@testing-library/user-event'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import { act } from '@testing-library/react'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import RolesSettingsTab, { AddMemberToRole, RoleList } from './RolesSettingsTab'

describe('RolesSettingsTab', () => {
  it('clears suggestions on unmount', () => {
    const clearStewardSuggestions = jest.fn()
    const wrapper = shallow(<RolesSettingsTab clearStewardSuggestions={clearStewardSuggestions} commonRoles={[]} />)
    wrapper.unmount()
    expect(clearStewardSuggestions).toHaveBeenCalled()
  })
})

describe('RoleList', () => {
  it('renders correctly', async () => {
    const props = {
      clearStewardSuggestions: () => {},
      fetchStewardSuggestions: () => {},
      roleId: '1',
      slug: 'foogroup',
      suggestions: [],
      isCommonRole: true,
      group: { id: 1 },
      fetchMembersForCommonRole: () => Promise.resolve({ response: { payload: { data: { group: { members: { items: [] } } } } } }),
      t: (str) => str
    }

    mockGraphqlServer.resetHandlers(
      graphql.query('fetchResponsibilitiesForCommonRole', (req, res, ctx) => {
        return res(
          ctx.data({
            responsibilities: []
          })
        )
      }),
      graphql.query('fetchResponsibiltiesForGroup', (req, res, ctx) => {
        return res(
          ctx.data({
            responsibilities: []
          })
        )
      })
    )

    await act(async () => {
      const { asFragment } = render(<RoleList {...props} />, { wrapper: AllTheProviders() })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

describe('AddMemberToRole', () => {
  it('renders correctly, and transitions from not adding to adding', async () => {
    const props = {
      fetchSuggestions: () => {},
      clearSuggestions: () => {}
    }
    const { asFragment } = render(<AddMemberToRole {...props} />, { wrapper: AllTheProviders() }) // shallow(<TestWrapper><AddMemberToRole /></TestWrapper>)
    expect(asFragment()).toMatchSnapshot()
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-new'))
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders correctly when adding with suggestions', async () => {
    const props = {
      fetchSuggestions: () => {},
      clearSuggestions: () => {},
      suggestions: [
        { id: 1, name: 'Demeter' },
        { id: 2, name: 'Ares' },
        { id: 1, name: 'Hermes' }
      ]
    }

    const { asFragment } = render(<AddMemberToRole {...props} />, { wrapper: AllTheProviders() })
    const user = userEvent.setup()
    await user.click(screen.getByTestId('add-new'))

    expect(asFragment()).toMatchSnapshot()
  })

  it('handles interactions correctly', async () => {
    const fetchStewardSuggestions = jest.fn()
    const clearStewardSuggestions = jest.fn()

    render(
      <AddMemberToRole
        fetchSuggestions={fetchStewardSuggestions}
        clearSuggestions={clearStewardSuggestions}
      />
      , { wrapper: AllTheProviders() }
    )

    const user = userEvent.setup()

    await user.click(screen.getByTestId('add-new'))
    expect(clearStewardSuggestions).toHaveBeenCalledTimes(1)
    const input = screen.getByTestId('add-member-input')
    fetchStewardSuggestions.mockClear()
    clearStewardSuggestions.mockClear()
    await user.type(input, 'Artem')
    expect(fetchStewardSuggestions).toHaveBeenCalledWith('Artem')
    expect(clearStewardSuggestions).not.toHaveBeenCalled()
    fetchStewardSuggestions.mockClear()
    clearStewardSuggestions.mockClear()
    await user.clear(input)
    expect(clearStewardSuggestions).toHaveBeenCalledTimes(1)
    expect(fetchStewardSuggestions).not.toHaveBeenCalled()
    fetchStewardSuggestions.mockClear()
    clearStewardSuggestions.mockClear()
    await input.focus()
    await user.keyboard('{Enter}')
    clearStewardSuggestions.mockClear()
    await userEvent.keyboard('{Enter}')
    expect(clearStewardSuggestions).not.toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    expect(clearStewardSuggestions).toHaveBeenCalled()
  })
})
