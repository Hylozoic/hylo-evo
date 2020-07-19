import { fetchPosts } from './MapExplorer.store'

it('works for a community', () => {
  expect(fetchPosts({
    subject: 'community',
    id: 'foo',
    offset: 20,
    search: 'gardening',
    filter: 'offer'
  })).toMatchSnapshot()
})

it('works for all communities', () => {
  expect(fetchPosts({
    subject: 'all-communities',
    offset: 20,
    search: 'graphic design',
    filter: 'request'
  })).toMatchSnapshot()
})
