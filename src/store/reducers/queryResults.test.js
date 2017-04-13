import queryResults from './queryResults'
import { FETCH_MEMBERS } from 'routes/Members/Members.store'

const variables = {slug: 'foo', sortBy: 'name'}

const key = JSON.stringify({
  type: FETCH_MEMBERS,
  params: variables
})

it('adds data to empty state', () => {
  const state = {}
  const action = {
    type: FETCH_MEMBERS,
    payload: {
      data: {
        community: {
          members: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}]
          }
        }
      }
    },
    meta: {
      graphql: {variables}
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [7, 8, 9],
      total: 22
    }
  })
})

it('appends to existing data, ignoring duplicates', () => {
  const state = {
    [key]: {
      ids: [4, 7, 5, 6],
      total: 21
    }
  }

  const action = {
    type: FETCH_MEMBERS,
    payload: {
      data: {
        community: {
          members: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}]
          }
        }
      }
    },
    meta: {
      graphql: {
        variables: {slug: 'foo', sortBy: 'name'}
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [4, 7, 5, 6, 8, 9],
      total: 22
    }
  })
})
