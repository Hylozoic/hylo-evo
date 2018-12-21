import { mapStateToProps, mapDispatchToProps, mergeProps } from './PostHeader.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('maps', () => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: 33, slug: 'mycommunity'})
    session.Me.create({id: 20,
      memberships: [session.Membership.create({
        id: '345',
        community: 33,
        hasModeratorRole: true
      })]})

    const state = {
      orm: session.state
    }

    const ownProps = {creator: {id: 20}, routeParams: { slug: 'mycommunity' }}
    const { community, currentUser } = mapStateToProps(state, ownProps)

    expect(community.id).toBe(33)
    expect(currentUser.id).toBe(20)
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    window.confirm = jest.fn()
    const dispatch = jest.fn(val => val)
    const props = {
      routeParams: {
        slug: 'mycommunity'
      }
    }
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps).toMatchSnapshot()
    dispatchProps.removePost(10)
    dispatchProps.editPost(10)
    expect(dispatch).toHaveBeenCalledTimes(2)

    dispatchProps.deletePost(1)
    dispatchProps.pinPost(2, 3)
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this post?')
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
      const community = session.Community.create({id: 33, slug: 'mycommunity'})
      session.Me.create({id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: true
        })]})
      const state = {
        orm: session.state
      }
      const ownProps = {id: 20, routeParams: { slug: 'mycommunity' }, creator: {id: 20}}
      const stateProps = mapStateToProps(state, ownProps)
      const { deletePost, removePost, editPost, canEdit, pinPost } = mergeProps(stateProps, dispatchProps, ownProps)

      expect(canEdit).toBeTruthy()
      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()
      expect(editPost).toBeTruthy()

      deletePost()
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20)

      editPost()
      expect(dispatchProps.editPost).toHaveBeenCalledWith(20)

      pinPost()
      expect(dispatchProps.pinPost).toHaveBeenCalledWith(20, 33)
    })

    it('cannot delete posts but can moderate', () => {
      const session = orm.session(orm.getEmptyState())
      const community = session.Community.create({id: 33, slug: 'mycommunity'})
      session.Me.create({id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: true
        })]})

      const state = {
        orm: session.state
      }

      const ownProps = {id: 20, routeParams: { slug: 'mycommunity' }, creator: {id: 33}}
      const stateProps = mapStateToProps(state, ownProps)

      const {deletePost, removePost, editPost} = mergeProps(stateProps, dispatchProps, ownProps)

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
      const community = session.Community.create({id: 33, slug: 'mycommunity'})
      session.Me.create({id: 20,
        memberships: [session.Membership.create({
          id: '345',
          community: community.id,
          hasModeratorRole: false
        })]})

      const state = {
        orm: session.state
      }

      const ownProps = {id: 20, routeParams: { slug: 'mycommunity' }, creator: {id: 20}}
      const stateProps = mapStateToProps(state, ownProps)

      const {deletePost, removePost, editPost, pinPost} = mergeProps(stateProps, dispatchProps, ownProps)

      expect(editPost).toBeTruthy()
      expect(deletePost).toBeTruthy()
      expect(removePost).toBeFalsy()
      expect(pinPost).toBeFalsy()

      deletePost()
      expect(dispatchProps.deletePost).toHaveBeenCalledWith(20)
    })
  })

  it('cannot delete or remove posts if not creator or moderator', () => {
    const session = orm.session(orm.getEmptyState())
    const community = session.Community.create({id: 33, slug: 'mycommunity'})
    session.Me.create({id: 20,
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: false
      })]})

    const state = {
      orm: session.state
    }

    const ownProps = {id: 20, routeParams: { slug: 'mycommunity' }, creator: {id: 33}}
    const stateProps = mapStateToProps(state, ownProps)

    const {deletePost, removePost, editPost} = mergeProps(stateProps, dispatchProps, ownProps)

    expect(deletePost).toBeFalsy()
    expect(removePost).toBeFalsy()
    expect(editPost).toBeFalsy()
  })
})
