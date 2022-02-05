import orm from 'store/models'

import {
  DELETE_SAVED_SEARCH,
  FETCH_SAVED_SEARCHES,
  SAVE_SEARCH
} from 'store/constants'

import reducer, {
  fetchGroups,
  fetchMembers,
  fetchPostsForDrawer,
  fetchPostsForMap,
  formatBoundingBox,
  FETCH_GROUPS_MAP,
  FETCH_MEMBERS_MAP,
  FETCH_POSTS_MAP,
  FETCH_POSTS_MAP_DRAWER,
  STORE_CLIENT_FILTER_PARAMS,
  UPDATE_STATE,
  getPostsForMapFilteredByType,
  getSearchedPostsForMap,
  getFilteredPostsForMap,
  getCurrentTopics,
  getMembersFilteredByType,
  getMembersFilteredBySearch,
  getMembersFilteredByTopics,
  getGroupsFilteredByType,
  getGroupsFilteredBySearch,
  getGroupsFilteredByTopics
} from './MapExplorer.store'

describe('formatBoundingBox', () => {
  it('formats a bounding box', () => {
    expect(formatBoundingBox([12, 13, 14, 15])).toEqual([{ lng: 12, lat: 13}, { lng: 14, lat: 15}])
  })
})

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
      featureTypes: { offer: true, request: false, event: true },
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

describe('selectors', () => {
  let session, state

  session = orm.session(orm.getEmptyState())
  session.Person.create({ id: 1, name: 'Jim', tagline: 'Let us get weird' })
  session.Topic.create({ id: 1, name: 'food' })
  session.Topic.create({ id: 2, name: 'weird' })
  session.Post.create({ id: 1, type: 'discussion', title: 'Shall we eat potatoes?', details: '', topics: [1] })
  session.Post.create({ id: 2, type: 'request', title: 'Who has turnips!?', details: '', topics: [] })
  session.Group.create({ id: 1, slug: 'bar', name: 'Excellent Group', description: 'We love food' })

  state = {
    orm: session.state,
    queryResults: {
      '{"type":"MapExplorer/FETCH_POSTS_MAP","params":{"context":"groups","slug":"bar"}}': {
        hasMore: false,
        ids: [1, 2]
      },
      '{"type":"MapExplorer/FETCH_MEMBERS_MAP","params":{"context":"groups","slug":"bar"}}': {
        hasMore: false,
        ids: [1]
      },
      '{"type":"MapExplorer/FETCH_GROUPS_MAP","params":{"context":"groups","slug":"bar"}}': {
        hasMore: false,
        ids: [1]
      }
    },
    MapExplorer: {
      zoom: 10,
      clientFilterParams: {
        currentBoundingBox: null,
        featureTypes: { discussion: true, request: true },
        search: '',
        sortBy: 'name',
        topics: []
      }
    }
  }

  describe('getPostsForMapFilteredByType', () => {
    it('filters out posts by type', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { discussion: true, request: false }
      const result = getPostsForMapFilteredByType(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
      expect(result[0].type).toEqual('discussion')
    })
  })

  describe('getSearchedPostsForMap', () => {
    it('filters out posts by search text', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { discussion: true, request: true }
      state.MapExplorer.clientFilterParams.search = 'turnip'
      const result = getSearchedPostsForMap(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
      expect(result[0].title).toEqual('Who has turnips!?')
    })
  })

  describe('getFilteredPostsForMap', () => {
    it('filters out posts by topic', () => {
      state.MapExplorer.clientFilterParams.search = ''
      state.MapExplorer.clientFilterParams.topics = [{ id: 1, name: 'food' }]

      const result = getFilteredPostsForMap(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
      expect(result[0].title).toEqual('Shall we eat potatoes?')
    })
  })

  describe('getCurrentTopics', () => {
    it('gets all topics used by posts on the map', () => {
      const result = getCurrentTopics(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
      expect(result[0].name).toEqual('food')
    })
  })

  describe('getMembersFilteredByType', () => {
    it('gets members if map is showing members', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { member: true }
      let result = getMembersFilteredByType(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
      expect(result[0].name).toEqual('Jim')

      state.MapExplorer.clientFilterParams.featureTypes = { member: false }
      result = getMembersFilteredByType(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)
    })
  })

  describe('getMembersFilteredBySearch', () => {
    it('filters members by search text', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { member: true }

      state.MapExplorer.clientFilterParams.search = 'cheese'
      let result = getMembersFilteredBySearch(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)

      state.MapExplorer.clientFilterParams.search = 'Jim'
      result = getMembersFilteredBySearch(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
    })
  })

  describe('getMembersFilteredByTopics', () => {
    it('filters members by search topics', () => {
      state.MapExplorer.clientFilterParams.search = ''
      state.MapExplorer.clientFilterParams.topics = [{ id: 1, name: 'food' }]
      let result = getMembersFilteredByTopics(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)

      state.MapExplorer.clientFilterParams.topics = [{ id: 2, name: 'weird' }]
      result = getMembersFilteredByTopics(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
    })
  })

  describe('getGroupsFilteredByType', () => {
    it('gets groups if map is showing groups', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { group: true }
      let result = getGroupsFilteredByType(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)

      state.MapExplorer.clientFilterParams.featureTypes = { group: false }
      result = getGroupsFilteredByType(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)
    })
  })

  describe('getGroupsFilteredBySearch', () => {
    it('filters groups by search text', () => {
      state.MapExplorer.clientFilterParams.featureTypes = { group: true }

      state.MapExplorer.clientFilterParams.search = 'cheese'
      let result = getGroupsFilteredBySearch(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)

      state.MapExplorer.clientFilterParams.search = 'Excellent'
      result = getGroupsFilteredBySearch(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
    })
  })

  describe('getGroupsFilteredByTopics', () => {
    it('filters group by search topics', () => {
      state.MapExplorer.clientFilterParams.search = ''
      state.MapExplorer.clientFilterParams.topics = [{ id: 2, name: 'something' }]
      let result = getGroupsFilteredByTopics(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(0)

      state.MapExplorer.clientFilterParams.topics = [{ id: 1, name: 'food' }]
      result = getGroupsFilteredByTopics(state, { context: 'groups', slug: 'bar' })
      expect(result.length).toEqual(1)
    })
  })

})

describe('reducer', () => {
  let state

  beforeAll(() => {
    state = {
      zoom: 10,
      clientFilterParams: {
        currentBoundingBox: null,
        featureTypes: {},
        search: '',
        sortBy: 'name',
        topics: []
      },
      searches: [ { id: '1'}, { id: '2' } ]
    }
  })

  describe(`when ${UPDATE_STATE}`, () => {
    it('updates the state', () => {

      const action = {
        type: UPDATE_STATE,
        payload: { zoom: 5 }
      }

      expect(reducer(state, action).zoom).toEqual(5)
    })
  })

  describe('on STORE_CLIENT_FILTER_PARAMS', () => {
    it('updates filter params', () => {
      const action = {
        type: STORE_CLIENT_FILTER_PARAMS,
        payload: { search: 'hello' }
      }
      expect(reducer(state, action).clientFilterParams.search).toEqual('hello')
    })
  })

  describe('on FETCH_SAVED_SEARCHES', () => {
    it('replaces searches', () => {
      const action = {
        type: FETCH_SAVED_SEARCHES,
        payload: { data : { savedSearches: { items: [{ id: '3' }] } } }
      }
      expect(reducer(state, action).searches).toEqual([{ id: '3' }])
    })
  })

  describe('on SAVE_SEARCH', () => {
    it('adds to the searches', () => {
      const action = {
        type: SAVE_SEARCH,
        payload: { data : { createSavedSearch: { id: '4' } } }
      }
      const searches = reducer(state, action).searches
      expect(searches.find(s => s.id === '4')).toBeTruthy()
      expect(searches.length).toBe(3)
    })
  })

  describe('on DELETE_SAVED_SEARCH', () => {
    it('removes the search', () => {
      const action = {
        type: DELETE_SAVED_SEARCH,
        payload: { data : { savedSearches: { items: [{ id: '4' }] } } }
      }
      const searches = reducer(state, action).searches
      expect(searches.find(s => s.id === '4')).toBeFalsy()
      expect(searches.length).toBe(2)
    })
  })
})
