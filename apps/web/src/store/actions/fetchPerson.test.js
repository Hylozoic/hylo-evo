import fetchPerson from './fetchPerson'

describe('fetchPerson', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_PERSON',
      graphql: {
        query: 'A very wombaty query.',
        variables: {
          id: '12345'
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchPerson(variables.id, query)
    expect(actual).toEqual(expected)
  })
})
