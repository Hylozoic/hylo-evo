import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps } from './Feed.connector'

describe('mapStateToProps', () => {
  let session, state
  const locationProps = {
    search: ''
  }
  const matchProps = {
    params: {
      slug: 'foo'
    }
  }

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
    session.Group.create({ id: '1', slug: 'foo', postCount: 10 })
    session.Topic.create({
      id: '2',
      name: 'petitions',
      postsTotal: '100',
      followersTotal: '200'
    })
    session.GroupTopic.create({
      id: '3',
      group: '1',
      topic: '2',
      postsTotal: '10',
      followersTotal: '20'
    })
    state = {
      pending: {},
      orm: session.state
    }
  })

  it('sets post type filter, and sortBy from the router props', () => {
    const props = {
      match: matchProps,
      location: {
        search: '?t=request&s=votes'
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      postTypeFilter: 'request',
      sortBy: 'votes'
    })
  })

  it('sets group from the router props', () => {
    const props = {
      location: locationProps,
      match: matchProps
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      group: expect.objectContaining({ id: '1', slug: 'foo' })
    })
  })

  it('sets groupTopic from the router props', () => {
    const props = {
      location: locationProps,
      match: {
        params: {
          slug: 'foo',
          topicName: 'petitions'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      groupTopic: expect.objectContaining({ id: '3', postsTotal: '10' })
    })
  })

  it('sets topic from the router props', () => {
    const props = {
      location: locationProps,
      match: {
        params: {
          slug: 'foo',
          topicName: 'petitions'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      topic: expect.objectContaining({ id: '2', name: 'petitions' })
    })
  })

  it('sets selectedPostId from the router props', () => {
    const props = {
      location: locationProps,
      match: {
        params: {
          slug: 'foo',
          postId: '24'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      selectedPostId: '24'
    })
  })

  it('sets postsTotal and followersTotal from the groupTopic when there is one', () => {
    const props = {
      location: locationProps,
      match: {
        params: {
          slug: 'foo',
          topicName: 'petitions'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      postsTotal: '10',
      followersTotal: '20'
    })
  })

  it('sets postsTotal and followersTotal from the topic when there is no groupTopic', () => {
    const props = {
      location: locationProps,
      match: {
        params: {
          topicName: 'petitions'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchObject({
      postsTotal: '100',
      followersTotal: '200'
    })
  })
})

describe('mapDispatchToProps', () => {
  it('correctly sets up changeTab and changeSort', () => {
    const dispatch = jest.fn(x => x)
    const props = {
      location: {
        search: '?s=votes&t=offer',
        pathname: '/c/foo'
      },
      match: {
        params: { slug: 'foo' }
      }
    }

    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.changeTab('request')).toMatchSnapshot()
    expect(dispatchProps.changeSort('updated')).toMatchSnapshot()
  })

  describe('fetchTopic', () => {
    it('will call fetchGroupTopic if groupSlug and topicName are in the url', () => {
      const dispatch = jest.fn(x => Promise.resolve(x))
      const props = {
        location: {
          search: '?s=votes&t=offer',
          pathname: '/c/foo/petitions'
        },
        match: {
          params: {
            slug: 'foo',
            topicName: 'petitions'
          }
        }
      }
      const dispatchProps = mapDispatchToProps(dispatch, props)
      expect(dispatchProps.fetchTopic()).toMatchSnapshot()
    })

    it('will call fetchTopic if only topicName is in the url', () => {
      const dispatch = jest.fn(x => x)
      const props = {
        location: {
          search: '?s=votes&t=offer',
          pathname: '/all/petitions'
        },
        match: {
          params: {
            topicName: 'petitions'
          }
        }
      }
      const dispatchProps = mapDispatchToProps(dispatch, props)
      expect(dispatchProps.fetchTopic()).toMatchSnapshot()
    })
  })
})
