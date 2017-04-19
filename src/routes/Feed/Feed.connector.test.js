import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { mapStateToProps } from './Feed.connector'
import { times } from 'lodash/fp'
import { buildKey } from 'store/reducers/queryResults'

describe('mapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: '1', slug: 'foo', postCount: 10})
    times(i => {
      session.Post.create({id: i.toString(), communities: ['1']})
    }, 5)

    state = {
      orm: session.state,
      pending: {},
      queryResults: {
        [buildKey(FETCH_POSTS, {slug: 'foo'})]: {
          ids: ['1', '3', '2']
        }
      }
    }
  })

  it("returns empty posts if a community doesn't exist", () => {
    const expected = {
      slug: 'bar',
      posts: [],
      pending: undefined,
      postCount: undefined,
      community: null
    }
    expect(mapStateToProps(state, {match: {params: {slug: 'bar'}}}))
    .toEqual(expected)
  })

  it('returns the community, postCount, and correct posts in the correct order', () => {
    const expected = {
      slug: 'foo',
      pending: undefined,
      postCount: 10,
      community: {
        slug: 'foo'
      }
    }

    const result = mapStateToProps(state, {match: {params: {slug: 'foo'}}})
    expect(result).toMatchObject(expected)
    expect(result.posts).toHaveLength(3)
    expect(result.posts.map(p => p.id)).toEqual(['1', '3', '2'])
  })

  it('checks if FETCH_POSTS is pending', () => {
    const expected = {
      slug: 'foo',
      pending: true
    }

    const stateWithPending = {
      ...state,
      pending: {
        [FETCH_POSTS]: true
      }
    }

    const result = mapStateToProps(stateWithPending, {match: {params: {slug: 'foo'}}})
    expect(result).toMatchObject(expected)
  })
})
