import { deleteMatch, fetchPeople, setAutocomplete } from './PeopleSelector.store'
import { mapStateToProps } from './PeopleSelector.connector'

describe('fetchPeople', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_PEOPLE',
      graphql: {
        query: 'All the lonely people / Where do they all come from?',
        variables: {
          autocomplete: 'Tchaikovs',
          first: 100
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchPeople(variables.autocomplete, query, variables.first)
    expect(actual).toEqual(expected)
  })
})

describe('deleteMatch', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'PEOPLE_SELECTOR_DELETE_MATCH',
      payload: '1'
    }
    const actual = deleteMatch('1')
    expect(actual).toEqual(expected)
  })
})

describe('setAutocomplete', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'PEOPLE_SELECTOR_SET_AUTOCOMPLETE',
      payload: 'Tchaikovs'
    }
    const actual = setAutocomplete('Tchaikovs')
    expect(actual).toEqual(expected)
  })
})
