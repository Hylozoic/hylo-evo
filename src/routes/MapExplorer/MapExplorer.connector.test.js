import orm from 'store/models'
import { mapStateToProps } from './MapExplorer.connector'
import { buildKey } from 'store/reducers/queryResults'
import { FETCH_POSTS_MAP } from 'store/constants'
import { times } from 'lodash/fp'

describe('mapStateToProps', () => {
  let state
  let props

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())

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
          topics: []
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
        centerLocation: { lat: 35.442845, lng: 7.916598 },
        currentUser: undefined,
        context: 'groups',
        fetchParams: { boundingBox: undefined, slug: 'foo', context: 'groups', groupSlugs: undefined, isPublic: false },
        filters: {
          featureTypes: { offer: true, request: true },
          search: '',
          topics: []
        },
        group: null,
        groups: [],
        members: [],
        pending: undefined,
        posts: [],
        hideDrawer: false,
        searches: undefined,
        selectedSearch: {},
        routeParams: { context: 'groups', groupSlug: 'foo' },
        topics: [],
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
    expect(result).toMatchObject({ pending: true })
  })
})
