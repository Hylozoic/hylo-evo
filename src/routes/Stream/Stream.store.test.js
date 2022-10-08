import { fetchGroupTopic, fetchTopic, fetchPosts } from './Stream.store'

describe('fetchGroupTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchGroupTopic('petitions', 'goteam')).toMatchSnapshot()
  })
})

describe('fetchTopic', () => {
  it('should match latest snapshot', () => {
    expect(fetchTopic('petitions')).toMatchSnapshot()
  })
})

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
