import orm from 'store/models'
import { mapStateToProps } from './FeedList.connector'
import { buildKey } from 'store/reducers/queryResults'
import { FETCH_POSTS } from 'store/constants'
import { times } from 'lodash/fp'

describe('mapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())

    times(i => {
      session.Post.create({ id: i.toString(), groups: ['1'] })
    }, 5)

    state = {
      orm: session.state,
      pending: {},
      queryResults: {
        [buildKey(FETCH_POSTS, { filter: 'foo' })]: {
          ids: ['1', '3', '2'],
          hasMore: true
        }
      }
    }
  })

  it('returns empty posts if no results exist', () => {
    expect(mapStateToProps(state, { routeParams: {}, postTypeFilter: 'bar' })).toHaveProperty('posts', [])
  })

  it('returns posts in the correct order', () => {
    expect(mapStateToProps(state, { routeParams: {}, postTypeFilter: 'foo' })).toEqual(
      expect.objectContaining({
        hasMore: true,
        pending: undefined,
        posts: [
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '3' }),
          expect.objectContaining({ id: '2' })
        ]
      })
    )
  })

  it('checks if FETCH_POSTS is pending', () => {
    state = {
      ...state,
      pending: { [FETCH_POSTS]: true }
    }
    const result = mapStateToProps(state, { routeParams: {}, groupId: '1' })
    expect(result).toMatchObject({ pending: true })
  })
})
