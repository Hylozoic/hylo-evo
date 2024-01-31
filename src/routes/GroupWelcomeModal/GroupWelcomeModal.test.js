import React from 'react'
import { graphql } from 'msw'
import userEvent from '@testing-library/user-event'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import orm from 'store/models'
import extractModelsForTest from 'util/testing/extractModelsForTest'
import GroupWelcomeModal from './GroupWelcomeModal'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

it('selects group, displays agreements and suggested skills, and renders nothing when showJoinForm is false', async () => {
  const testGroup = {
    id: '1',
    name: 'Test Group',
    slug: 'test-group',
    bannerUrl: 'anything',
    settings: {
      showSuggestedSkills: true
    }
  }
  const testMembership = {
    id: '1',
    person: { id: '1' },
    settings: {
      showJoinForm: true
    },
    group: testGroup
  }

  function testProviders () {
    const ormSession = orm.mutableSession(orm.getEmptyState())
    const reduxState = { orm: ormSession.state }

    extractModelsForTest({
      me: {
        id: '1',
        memberships: {
          items: [testMembership]
        }
      }
    }, 'Me', ormSession)

    return AllTheProviders(reduxState)
  }

  mockGraphqlServer.resetHandlers(
    graphql.query('GroupWelcomeQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          group: {
            id: testGroup.id,
            agreements: {
              items: [{ id: 1, description: 'Do good stuff always', title: 'Be cool' }]
            },
            suggestedSkills: {
              items: [
                { id: '1', name: 'a-skill-to-have' }
              ]
            }
          }
        })
      )
    }),
    graphql.mutation('UpdateMembershipSettings', (req, res, ctx) => {
      return res(
        ctx.data({
          group: {
            id: testGroup.id
          }
        })
      )
    })
  )

  const { container } = render(
    <GroupWelcomeModal group={testGroup} match={{ params: { groupSlug: testGroup.slug } }} />,
    { wrapper: testProviders() }
  )

  const user = userEvent.setup()

  // expect(await screen.findByText(`Welcome to ${testGroup.name}!`)).toBeInTheDocument() TODO: Fix this test
  expect(await screen.findByText('Do good stuff always')).toBeInTheDocument()

  const cbEl = screen.getByTestId('cbAgreement0')
  expect(cbEl).toBeInTheDocument()
  expect(cbEl).not.toBeChecked()

  await user.click(cbEl)
  await user.click(screen.getByTestId('jump-in'))
  expect(await screen.findByText('a-skill-to-have')).toBeInTheDocument()
  await user.click(screen.getByTestId('jump-in'))

  expect(container).toBeEmptyDOMElement()
})
