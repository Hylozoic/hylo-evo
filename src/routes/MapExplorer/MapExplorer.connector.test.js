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
      session.Post.create({ id: i.toString(), communities: ['1'] })
    }, 5)

    props = {
      location: { search: '' },
      match: {
        params: { 'slug': 'foo' }
      }
    }

    state = {
      orm: session.state,
      pending: {},
      MapExplorer: {
        fetchPostsParam: { },
        clientFilterParams: {
          featureTypes: { request: true, offer: true },
          search: '',
          topics: []
        }
      },
      queryResults: {
        [buildKey(FETCH_POSTS_MAP, { slug: 'foo' })]: {
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
        features: [],
        fetchMembersParam: { boundingBox: undefined, slug: 'foo', subject: 'community', networkSlug: undefined },
        fetchPostsParam: { boundingBox: undefined, slug: 'foo', subject: 'community', networkSlug: undefined, networkSlugs: undefined, isPublic: false },
        fetchPublicCommunitiesParam: { boundingBox: undefined, subject: 'community', networkSlugs: undefined },
        filters: {
          featureTypes: { offer: true, request: true },
          search: '',
          topics: []
        },
        members: [],
        pending: undefined,
        posts: [],
        publicCommunities: [],
        showDrawer: false,
        routeParams: { slug: 'foo' },
        topics: [],
        zoom: 0
      })
    )
  })

  // TODO: one with posts and members and communities

  it('checks if FETCH_POSTS_MAP is pending', () => {
    state = {
      ...state,
      pending: { [FETCH_POSTS_MAP]: true }
    }
    const result = mapStateToProps(state, props)
    expect(result).toMatchObject({ pending: true })
  })
})
