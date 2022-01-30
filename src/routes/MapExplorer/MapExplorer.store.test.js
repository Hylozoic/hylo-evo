import { fetchGroups, fetchMembers, fetchPostsForDrawer, fetchPostsForMap } from './MapExplorer.store'

describe('fetchPostsforMap', () => {
  it('works for a group', () => {
    expect(fetchPostsForMap({
      boundingBox: [122.60387590065002, 37.698360551679215, -121.93892409934989, 37.91048712726531],
      context: 'groups',
      groupSlugs: ['foo'],
      offset: 0,
      search: 'gardening',
      slug: 'foo'
    })).toMatchSnapshot()
  })

  it('works for all groups', () => {
    expect(fetchPostsForMap({
      boundingBox: [122.60387590065002, 37.698360551679215, -121.93892409934989, 37.91048712726531],
      context: 'all',
      offset: 0,
      search: 'graphic design',
      filter: 'request'
    })).toMatchSnapshot()
  })
})

describe('fetchPostsforDrawer', () => {
  it('works for a group', () => {
    expect(fetchPostsForDrawer({
      context: 'groups',
      currentBoundingBox: [122.60387590065002, 37.698360551679215, -121.93892409934989, 37.91048712726531],
      featureTypes: ['offer', 'request'],
      groupSlugs: ['foo'],
      offset: 0,
      search: 'food',
      slug: 'foo',
      sortBy:'updated',
      topics: []
    })).toMatchSnapshot()
  })
})

describe('fetchMembers', () => {
  it('works for a group', () => {
    expect(fetchMembers({
      context: 'groups',
      boundingBox: [122.60387590065002, 37.698360551679215, -121.93892409934989, 37.91048712726531],
      groupSlugs: ['foo'],
      offset: 0,
      search: 'food',
      slug: 'foo'
    })).toMatchSnapshot()
  })
})

describe('fetchGroups', () => {
  it('works for public context', () => {
    expect(fetchGroups({
      context: 'public',
      boundingBox: [122.60387590065002, 37.698360551679215, -121.93892409934989, 37.91048712726531],
      offset: 0,
      search: 'food'
    })).toMatchSnapshot()
  })
})
