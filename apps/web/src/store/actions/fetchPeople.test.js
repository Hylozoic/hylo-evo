import fetchPeople from 'store/actions/fetchPeople'

it('matches the last snapshot', () => {
  const graphql = {
    query: 'All the lonely people / Where do they all come from?',
    variables: {
      autocomplete: 'Tchaikovs',
      first: 100
    }
  }
  const { query, variables } = graphql
  const actual = fetchPeople({ autocomplete: variables.autocomplete, groupIds: [], first: variables.first, query })
  expect(actual).toMatchSnapshot()
})
