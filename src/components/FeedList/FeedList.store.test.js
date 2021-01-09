import { fetchPosts } from './FeedList.store'

it('works for a group', () => {
  expect(fetchPosts({
    subject: 'group',
    id: 'foo',
    offset: 20,
    search: 'gardening',
    filter: 'offer'
  })).toMatchSnapshot()
})

it('works for all groups', () => {
  expect(fetchPosts({
    subject: 'all-groups',
    offset: 20,
    search: 'graphic design',
    filter: 'request'
  })).toMatchSnapshot()
})
