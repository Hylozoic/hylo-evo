import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostHeader.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('maps', () => {
    const session = orm.session(orm.getEmptyState())
    session.Group.create({ id: 33, slug: 'mygroup' })
    session.Me.create({ id: 20,
      memberships: [session.Membership.create({
        id: '345',
        group: 33,
        hasModeratorRole: true
      })] })

    const state = {
      orm: session.state
    }

    const ownProps = { creator: { id: 20 }, routeParams: { groupSlug: 'mygroup' } }
    const { group, currentUser } = mapStateToProps(state, ownProps)

    expect(group.id).toBe(33)
    expect(currentUser.id).toBe(20)
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    window.confirm = jest.fn()
    const dispatch = jest.fn(val => val)
    const props = {
      routeParams: {
        groupSlug: 'mygroup'
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.removePost(10)
    dispatchProps.editPost(10)
    expect(dispatch).toHaveBeenCalledTimes(2)

    dispatchProps.deletePost(1)
    dispatchProps.pinPost(2, 3)
    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  it('calls the right version of removePost', () => {
    const postId = 1
    const dispatch = jest.fn(val => val)

    const defaultProps = {
      routeParams: {}
    }

    const props1 = {
      ...defaultProps,
      editPost: () => {}
    }
    const dispatchProps1 = mapDispatchToProps(dispatch, props1)
    dispatchProps1.removePost(postId)
    expect(dispatch).toHaveBeenCalledTimes(1)

    const props2 = {
      ...defaultProps,
      removePost: jest.fn()
    }
    const dispatchProps2 = mapDispatchToProps(dispatch, props2)
    dispatchProps2.removePost(postId)
    expect(props2.removePost).toHaveBeenCalledWith(postId)

    const dispatchProps3 = mapDispatchToProps(dispatch, defaultProps)
    dispatchProps3.removePost(postId)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  const dispatchProps = {
    removePost: jest.fn(),
    deletePost: jest.fn(),
    editPost: jest.fn(),
    pinPost: jest.fn()
  }

  beforeEach(() => {
    dispatchProps.removePost.mockReset()
    dispatchProps.editPost.mockReset()
    dispatchProps.deletePost.mockReset()
    dispatchProps.pinPost.mockReset()
  })

  describe('as moderator', () => {
    it('can delete and edit own posts, and pin a post', () => {
      const session = orm.session(orm.getEmptyState())
      const group = session.Group.create({ id: 33, slug: 'mygroup' })
      session.Me.create({ id: 20,
        memberships: [session.Membership.create({
          id: '345',
          group: group.id,
          hasModeratorRole: true,
          commonRoles: { items: []}
        })] })
      const state = {
        orm: session.state
      }
      const ownProps = { id: 20, routeParams: { groupSlug: 'mygroup' }, creator: { id: 20 } }
      const stateProps = mapStateToProps(state, ownProps)
      const { deletePost, removePost, editPost, canEdit, pinPost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(canEdit).toBeTruthy()
      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()
      expect(editPost).toBeTruthy()

      deletePost('lettuce')
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20, 33, 'lettuce')

      editPost()
      expect(dispatchProps.editPost).toHaveBeenCalledWith(20)

      pinPost()
      expect(dispatchProps.pinPost).toHaveBeenCalledWith(20, 33)
    })

    it('cannot delete posts but can moderate', () => {
      const session = orm.session(orm.getEmptyState())
      const group = session.Group.create({ id: 33, slug: 'mygroup' })
      session.Me.create({ id: 20,
        memberships: [session.Membership.create({
          id: '345',
          group: group.id,
          hasModeratorRole: true,
          commonRoles: { items: []}
        })] })

      const state = {
        orm: session.state
      }

      const ownProps = { id: 20, routeParams: { groupSlug: 'mygroup' }, creator: { id: 33 } }
      const stateProps = mapStateToProps(state, ownProps)

      const { deletePost, removePost, editPost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(deletePost).toBeFalsy()
      expect(editPost).toBeFalsy()
      expect(removePost).toBeTruthy()

      removePost()
      expect(dispatchProps.removePost).toHaveBeenCalledWith(20)
    })
  })

  describe('as non-moderator', () => {
    it("can delete own posts, can't pin posts", () => {
      const session = orm.session(orm.getEmptyState())
      const group = session.Group.create({ id: 33, slug: 'mygroup' })
      session.Me.create({ id: 20,
        memberships: [session.Membership.create({
          id: '345',
          group: group.id,
          hasModeratorRole: false,
          commonRoles: { items: []}
        })] })

      const state = {
        orm: session.state
      }

      const ownProps = { id: 20, routeParams: { groupSlug: 'mygroup' }, creator: { id: 20 } }
      const stateProps = mapStateToProps(state, ownProps)

      const { deletePost, removePost, editPost, pinPost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(editPost).toBeTruthy()
      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()
      expect(pinPost).toBeFalsy()

      deletePost('lettuce')
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20, 33, 'lettuce')
    })
  })

  it('cannot delete or remove posts if not creator or moderator', () => {
    const session = orm.session(orm.getEmptyState())
    const group = session.Group.create({ id: 33, slug: 'mygroup' })
    session.Me.create({ id: 20,
      memberships: [session.Membership.create({
        id: '345',
        group: group.id,
        hasModeratorRole: false,
        commonRoles: { items: [] }
      })] })

    const state = {
      orm: session.state
    }

    const ownProps = { id: 20, routeParams: { groupSlug: 'mygroup' }, creator: { id: 33 } }
    const stateProps = mapStateToProps(state, ownProps)

    const { deletePost, removePost, editPost } = mergeProps(stateProps, dispatchProps, ownProps)

    expect(deletePost).toBeFalsy()
    expect(removePost).toBeFalsy()
    expect(editPost).toBeFalsy()
  })
})
