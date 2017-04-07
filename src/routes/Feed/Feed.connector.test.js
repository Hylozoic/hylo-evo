import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { mapStateToProps } from './Feed.connector'
import { times } from 'lodash/fp'

describe('mapStateToProps', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: '1', slug: 'foo', feedOrder: ['1', '3', '2'], postCount: 3})
    times(i => {
      session.Post.create({id: i.toString(), communities: ['1']})
    }, 5)
    state = {
      orm: session.state,
      pending: {}
    }
  })

  it("returns empty posts if a community doesn't exist", () => {
    const expected = {
      slug: 'bar',
      posts: [],
      pending: undefined,
      postCount: undefined,
      community: {}
    }
    expect(mapStateToProps(state, {match: {params: {slug: 'bar'}}}))
    .toEqual(expected)
  })

  it('returns the community, postCount, and correct posts in the correct order', () => {
    const expected = {
      slug: 'foo',
      pending: undefined,
      postCount: 3,
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
