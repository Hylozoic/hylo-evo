/* eslint no-unused-vars:'off' */
import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps } from './Events.connector'

describe('mapStateToProps', () => {
  let session, state

  const matchProps = {
    params: {
      groupSlug: 'foo'
    }
  }

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.Group.create({ id: '1', slug: 'foo', postCount: 10 })
    state = {
      pending: {},
      orm: session.state,
      Events: { timeframe: 'past' }
    }
  })

  it('sets group from the router props', () => {
    const props = {
      match: matchProps
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      group: expect.objectContaining({ id: '1', slug: 'foo' })
    })
  })
})

describe('mapDispatchToProps', () => {
  let state

  beforeEach(() => {
    state = {
      pending: {},
      Events: { timeframe: 'past' }
    }
  })

  it('correctly sets up updateTimeframe and fetchEvents', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      location: {
        pathname: '/groups/foo'
      },
      match: {
        params: { groupSlug: 'foo' }
      }
    }

    const fetchPostsParam = {
      afterTime: new Date().toISOString(),
      context: 'group',
      filter: 'event',
      order: 'asc',
      slug: 'foo',
      sortBy: 'start_time'
    }

    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.updateTimeframe('future')).toMatchSnapshot()
    expect(dispatchProps.fetchEvents(fetchPostsParam)).toMatchSnapshot()
    expect(dispatchProps.newPost(fetchPostsParam)).toMatchSnapshot()
  })
})
