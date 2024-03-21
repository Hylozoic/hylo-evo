import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostEditor.connector'
import orm from 'store/models'
import { CREATE_POST } from 'store/constants'

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
        hasModeratorRole: true,
        commonRoles: { items: [] }
      }),
      session.Membership.create({
        id: '678',
        group: group2.id,
        hasModeratorRole: false,
        commonRoles: { items: [] }
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
})
