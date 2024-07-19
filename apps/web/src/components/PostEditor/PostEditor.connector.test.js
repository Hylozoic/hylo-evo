import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostEditor.connector'
import orm from 'store/models'
import { CREATE_POST } from 'store/constants'
import { MAX_TITLE_LENGTH } from './PostEditor'

let state, requiredProps
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', slug: 'foo', name: 'foo' })
  const group2 = session.Group.create({ id: '100', slug: 'bar', name: 'bar' })

  session.LinkPreview.create({
    id: 1
  })

  session.Me.create({
    id: '1',
    memberships: [
      session.Membership.create({
        id: '345',
        group: group.id,
        hasModeratorRole: true
      }),
      session.Membership.create({
        id: '678',
        group: group2.id,
        hasModeratorRole: false
      })
    ]
  })

  state = {
    orm: session.state,
    PostEditor: {
      linkPreviewStatus: false
    },
    pending: {
      FETCH_LINK_PREVIEW: false
    }
  }
  requiredProps = {
    match: {},
    location: {
      search: ''
    }
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys for a new post', () => {
    const props = {
      ...requiredProps,
      match: {
        params: {
          slug: 'foo'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })

  it('sets myModeratedGroups appropriately', () => {
    expect(mapStateToProps(state, requiredProps).myModeratedGroups.length).toEqual(1)
  })

  it('returns the right keys for a new post while pending', () => {
    const props = {
      ...requiredProps,
      match: {
        params: {
          slug: 'foo'
        }
      }
    }

    const newState = {
      ...state,
      pending: {
        FETCH_LINK_PREVIEW: false,
        [CREATE_POST]: true
      }
    }
    expect(mapStateToProps(newState, props)).toMatchSnapshot()
  })

  it('sets myModeratedGroups appropriately', () => {
    expect(mapStateToProps(state, requiredProps).myModeratedGroups.length).toEqual(1)
  })

  it('returns the right keys for edit post', () => {
    const props = {
      ...requiredProps,
      match: {
        params: {
          postId: '2',
          action: 'edit'
        }
      },
      post: 'lettuce'
    }

    const { editingPostId, post, editing } = mapStateToProps(state, props)
    expect(editingPostId).toEqual('2')
    expect(editing).toBe(true)
    expect(post).toEqual('lettuce')
  })

  it('returns the right keys for duplicating a post', () => {
    const props = {
      ...requiredProps,
      match: { params: {} },
      location: { search: '?fromPostId=3' },
      groupOptions: [],
      post: { title: 'x'.repeat(MAX_TITLE_LENGTH - 1) }
    }
    const expectedTitle = `Copy of ${props.post.title.slice(0, MAX_TITLE_LENGTH - 8)}`

    const { post } = mapStateToProps(state, props)
    expect(post.title).toBe(expectedTitle)
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    expect(mapDispatchToProps()).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('goToPost redirects to topic with topicName', () => {
    const stateProps = {
      topicName: 'thetopicname',
      groupSlug: 'theslug'
    }
    const dispatchProps = {
      goToUrl: jest.fn()
    }
    const action = {
      payload: {
        data: {
          createPost: {
            id: 123
          }
        }
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps)
    mergedProps.goToPost(action)
    expect(dispatchProps.goToUrl).toHaveBeenCalled()
    expect(dispatchProps.goToUrl.mock.calls).toMatchSnapshot()
  })

  it('goToPost redirects to group feed with no topicName', () => {
    const stateProps = {
      groupSlug: 'theslug'
    }
    const dispatchProps = {
      goToUrl: jest.fn()
    }
    const action = {
      payload: {
        data: {
          createPost: {
            id: 123
          }
        }
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps)
    mergedProps.goToPost(action)
    expect(dispatchProps.goToUrl).toHaveBeenCalled()
    expect(dispatchProps.goToUrl.mock.calls).toMatchSnapshot()
  })

  it('goToPost redirects with the same stream params', () => {
    const stateProps = {
      groupSlug: 'theslug'
    }
    const dispatchProps = {
      goToUrl: postPath => { return postPath }
    }
    const ownProps = {
      location: {
        search: '?s=created&t=discussion&search=hylo'
      }
    }
    const action = {
      payload: {
        data: {
          createPost: {
            id: 123
          }
        }
      }
    }
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.goToPost(action)).toEqual('/all/post/123?s=created&t=discussion&search=hylo')
  })
})
