import React from 'react'
import { graphql } from 'msw'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import { render, AllTheProviders, screen } from 'util/testing/reactTestingLibraryExtended'
import GroupExplorer from './GroupExplorer'
import userEvent from '@testing-library/user-event'
import orm from 'store/models'
import { FARM_VIEW } from 'util/constants'

jest.mock('components/ScrollListener', () => () => <div />) // was throwing errors with this.element().removeEventListener('blabadlbakdbfl')

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }

  return AllTheProviders(reduxState)
}

afterEach(() => {
  mockGraphqlServer.resetHandlers()
})

// Disable API mocking after the tests are done.
afterAll(() => mockGraphqlServer.close())

test('GroupExplorer integration test', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.operation((req, res, ctx) => {
      const { search, groupType, farmQuery } = req.body.variables
      let items
      if (search === '') {
        items = firstGroupResults
      } else if (search === 'different group' && !groupType) {
        items = secondGroupResults
      } else if (search === 'different group' && groupType === FARM_VIEW && farmQuery.productCategories === '') {
        items = thirdGroupResults
      } else if (search === 'different group' && groupType === FARM_VIEW && farmQuery.productCategories === 'vegetables') {
        items = fourthGroupResults
      }
      return res(
        ctx.data({ groups: { hasMore: false, items, total: 0 } })
      )
    })
  )
  const user = userEvent.setup()

  render(
    <GroupExplorer />,
    { wrapper: testProviders() }
  )

  expect(await screen.findByText('Test Group Title')).toBeInTheDocument()
  expect(screen.queryByText('Search input results')).not.toBeInTheDocument()

  await user.type(screen.getByRole('textbox'), 'different group')
  expect(await screen.findByText('Search input results')).toBeInTheDocument()

  await user.click(screen.getByText('Farms'))
  expect(await screen.findByText('My fav farm')).toBeInTheDocument()

  await user.click(screen.getByText('Filters'))
  expect(await screen.findByText('Operation:')).toBeInTheDocument()

  await user.click(screen.getByText('Operation:'))
  expect(await screen.findByText('Vegetables')).toBeInTheDocument()

  await user.click(screen.getByText('Vegetables'))
  expect(await screen.findByText('Veggie farm')).toBeInTheDocument()
})

const firstGroupResults = [
  {
    accessibility: [3],
    memberCount: 12,
    description: 'Words do not belong in this here town',
    location: 'Baltimore',
    locationObject: {
      city: 'Baltimore',
      country: 'USA',
      fullText: 'Baltimore, USA',
      locality: '',
      neighborhood: '',
      region: 'East Coast'
    },
    id: '345',
    avatarUrl: 'wee.com',
    bannerUrl: 'wee.com',
    name: 'Test Group Title',
    slug: 'test-group-title',
    groupTopics: [],
    members: []
  }
]

const secondGroupResults = [
  {
    accessibility: [3],
    memberCount: 16,
    description: 'Completely different group don\'t you think',
    location: 'Somewhere else',
    locationObject: {
      city: 'Austin',
      country: 'USA',
      fullText: 'Austin, USA',
      locality: '',
      neighborhood: '',
      region: 'East Coast'
    },
    id: '345',
    avatarUrl: 'wee.com',
    bannerUrl: 'wee.com',
    name: 'Search input results',
    slug: 'test-group-title',
    groupTopics: [],
    members: []
  }
]

const thirdGroupResults = [
  {
    accessibility: [3],
    memberCount: 16,
    description: 'Woop',
    location: 'meep',
    locationObject: {
      city: 'Ouch',
      country: 'USA',
      fullText: 'Jerome, USA',
      locality: '',
      neighborhood: '',
      region: 'West Coast'
    },
    id: '345',
    avatarUrl: 'wee.com',
    bannerUrl: 'wee.com',
    name: 'My fav farm',
    slug: 'my-fav-farm',
    groupTopics: [],
    members: []
  }
]

const fourthGroupResults = [
  {
    accessibility: [3],
    memberCount: 16,
    description: 'Hah',
    location: 'LOPs',
    locationObject: {
      city: 'Lotus',
      country: 'USA',
      fullText: 'Smallsville, USA',
      locality: '',
      neighborhood: '',
      region: 'East Coast'
    },
    id: '345',
    avatarUrl: 'veggie.com',
    bannerUrl: 'veggie.com',
    name: 'Veggie farm',
    slug: 'veggie-farm',
    groupTopics: [],
    members: []
  }
]
