import fetchPosts from './fetchPosts'

it('works for a group', () => {
  expect(fetchPosts({
    context: 'groups',
    id: 'foo',
    offset: 20,
    search: 'gardening',
    filter: 'offer'
  })).toMatchSnapshot()
})

it('works for all groups', () => {
  expect(fetchPosts({
    context: 'all',
    offset: 20,
    search: 'graphic design',
    filter: 'request'
  })).toMatchSnapshot()
})
