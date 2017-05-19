import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps } from './Feed.connector'

describe('mapStateToProps', () => {
  let state, props

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: '1', slug: 'foo', postCount: 10})

    state = {
      orm: session.state,
      pending: {}
    }

    props = {
      location: {
        search: '?t=request&s=votes'
      },
      match: {
        params: {
          slug: 'foo'
        }
      }
    }
  })

  it('sets community, filter, and sortBy from the router props', () => {
    expect(mapStateToProps(state, props)).toMatchObject({
      filter: 'request',
      sortBy: 'votes',
      community: expect.objectContaining({id: '1', slug: 'foo'})
    })
  })
})

describe('mapDispatchToProps', () => {
  it('sets expected values', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      location: {
        search: '?s=votes&t=offer',
        pathname: '/c/foo'
      },
      match: {
        params: {slug: 'foo'}
      }
    }

    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.showPostDetails('5')).toMatchSnapshot()
    expect(dispatchProps.changeTab('request')).toMatchSnapshot()
    expect(dispatchProps.changeSort('updated')).toMatchSnapshot()
  })
})
