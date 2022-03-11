import React from 'react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import { history } from 'router'
import { generateStore, render, AllTheProviders, fireEvent } from 'util/reactTestingLibraryExtended'
import GroupExplorer from './GroupExplorer'
import orm from 'store/models'
import { FARM_VIEW } from 'util/constants'

let providersWithStore = null

const handlers = [
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
]

jest.mock('components/ScrollListener', () => () => <div />) // was throwing errors with this.element().removeEventListener('blabadlbakdbfl')

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

beforeEach(() => {
  // setup store
  const session = orm.mutableSession(orm.getEmptyState())
  session.Me.create({ id: '1' })
  const initialState = { orm: session.state }
  const store = generateStore(history, initialState)
  providersWithStore = AllTheProviders(store)
})

afterEach(() => {
  server.resetHandlers()
  providersWithStore = null
})

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('GroupExplorer integration test', async () => {
  const { findByText, getByRole, getByText } = render(
    <GroupExplorer />,
    null,
    providersWithStore
  )

  expect(await findByText('Test Group Title')).toBeInTheDocument()

  fireEvent.change(getByRole('textbox'), {
    target: { value: 'different group' }
  })

  expect(await findByText('Search input results')).toBeInTheDocument()

  fireEvent.click(getByText('Farms'))

  expect(await findByText('My fav farm')).toBeInTheDocument()

  fireEvent.click(getByText('Filters'))

  expect(await findByText('Operation:')).toBeInTheDocument()

  fireEvent.click(getByText('Operation:'))

  expect(await findByText('Vegetables')).toBeInTheDocument()

  fireEvent.click(getByText('Vegetables'))

  expect(await findByText('Veggie farm')).toBeInTheDocument()
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
