import orm from 'store/models'
import { mapStateToProps } from './MapExplorer.connector'
import { buildKey } from 'store/reducers/queryResults'
import { FETCH_POSTS_MAP } from './MapExplorer.store'
import { times } from 'lodash/fp'

describe('mapStateToProps', () => {
  let state
  let props

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())

    session.Group.create({ id: 1, slug: 'foo' })
    session.Me.create({ id: 1, settings: {} })

    times(i => {
      session.Post.create({ id: i.toString(), groups: ['1'] })
    }, 5)

    props = {
      location: { search: '' },
      match: {
        params: { context: 'groups', groupSlug: 'foo' }
      }
    }

    state = {
      orm: session.state,
      pending: {},
      MapExplorer: {
        fetchParams: { },
        clientFilterParams: {
          featureTypes: { request: true, offer: true },
          search: '',
          topics: [],
          types: ['request', 'offer']
        }
      },
      SavedSearches: {
        selectedSearch: {}
      },
      queryResults: {
        [buildKey(FETCH_POSTS_MAP, { groupSlug: 'foo' })]: {
          ids: ['1', '3', '2']
        }
      }
    }
  })

  it('returns posts in the correct order', () => {
    expect(mapStateToProps(state, props)).toEqual(
      expect.objectContaining({
        baseLayerStyle: undefined,
        centerLocation: { lat: 35.442845, lng: 7.916598 },
        context: 'groups',
        currentUser: expect.objectContaining({
          id: 1,
          settings: {}
        }),
        featureTypes: ['discussion', 'request', 'offer', 'resource', 'project', 'event', 'member', 'group'],
        fetchGroupParams: { boundingBox: undefined, context: 'groups', parentSlugs: ['foo'] },
        fetchMemberParams: { boundingBox: undefined, context: 'groups', slug: 'foo', sortBy: 'name' },
        fetchPostsParams: { boundingBox: undefined, childPostInclusion: 'yes', context: 'groups', groupSlugs: ['foo'], slug: 'foo' },
        fetchPostsForDrawerParams: { context: 'groups', childPostInclusion: 'yes', currentBoundingBox: undefined, featureTypes: { offer: true, request: true }, groupSlugs: ['foo'], search: '', slug: 'foo', topics: [], types: ['request', 'offer'] },
        filters: {
          featureTypes: { offer: true, request: true },
          search: '',
          topics: [],
          types: ['request', 'offer']
        },
        group: { id: 1, slug: 'foo' },
        groupPending: undefined,
        groups: [],
        hideDrawer: false,
        members: [],
        pendingPostsDrawer: undefined,
        pendingPostsMap: undefined,
        postsForDrawer: [],
        postsForMap: [],
        queryParams: {},
        routeParams: { context: 'groups', groupSlug: 'foo' },
        searches: undefined,
        selectedSearch: {},
        stateFilters: { featureTypes: { offer: true, request: true }, search: '', topics: [], types: ['request', 'offer'] },
        topics: [],
        totalBoundingBoxLoaded: undefined,
        zoom: 0
      })
    )
  })

  // TODO: one with posts and members and groups

  it('checks if FETCH_POSTS_MAP is pending', () => {
    state = {
      ...state,
      pending: { [FETCH_POSTS_MAP]: true }
    }
    const result = mapStateToProps(state, props)
    expect(result).toMatchObject({ pendingPostsMap: true })
  })
})
