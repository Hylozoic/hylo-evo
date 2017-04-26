import { fetchPeople } from './PeopleSelector.store'
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

describe('mapStateToProps', () => {
})
