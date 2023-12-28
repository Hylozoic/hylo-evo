import { mapStateToProps, mergeProps } from './Comment.connector'
import orm from 'store/models'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('mapStateToProps', () => {
  describe('as moderator', () => {
    let state, myComment, otherComment
    beforeAll(() => {
      const session = orm.session(orm.getEmptyState())
      const group = session.Group.create({ id: '99', slug: 'foo' })
      session.Group.create({ id: '88', slug: 'bar' })

      session.Me.create({
        id: '1',
        memberships: [session.Membership.create({
          id: '345',
          group: group.id,
          hasModeratorRole: true,
          commonRoles: { items: [] }
        })]
      })

      const meUser = session.Person.create({ id: '1' })
      const otherUser = session.Person.create({ id: '2' })
      myComment = session.Comment.create({ creator: meUser, parentComment: null })
      otherComment = session.Comment.create({ creator: otherUser, parentComment: null })

      state = {
        orm: session.state
      }
    })

    it('sets canModerate to true if you are moderator', () => {
      const props = mapStateToProps(state, { groupSlug: 'foo', comment: myComment })
      expect(props.canModerate).toBeTruthy()
    })

    it('sets canModerate to true if you can moderate someone elses comment', () => {
      const props = mapStateToProps(state, { groupSlug: 'foo', comment: otherComment })
      expect(props.canModerate).toBeTruthy()
    })
  })

  describe('as regular user', () => {
    let state, myComment, otherComment
    beforeAll(() => {
      const session = orm.session(orm.getEmptyState())
      const group = session.Group.create({ id: '99', slug: 'foo' })
      session.Group.create({ id: '88', slug: 'bar' })

      session.Me.create({
        id: '1',
        memberships: [session.Membership.create({
          id: '345',
          group: group.id,
          hasModeratorRole: false,
          commonRoles: { items: []}
        })]
      })
      const meUser = session.Person.create({ id: '1' })
      const otherUser = session.Person.create({ id: '2' })
      myComment = session.Comment.create({ creator: meUser, parentComment: null })
      otherComment = session.Comment.create({ creator: otherUser, parentComment: null })

      state = {
        orm: session.state
      }
    })

    it('sets isCreator to true when my own comment', () => {
      const props = mapStateToProps(state, { groupSlug: 'bar', comment: myComment })
      expect(props.canModerate).toBeFalsy()
      expect(props.isCreator).toBeTruthy()
    })

    it('sets isCreator to false otherwise', () => {
      const props = mapStateToProps(state, { groupSlug: 'bar', comment: otherComment })
      expect(props.canModerate).toBeFalsy()
      expect(props.isCreator).toBeFalsy()
    })

    it('sets canModerate to false otherwise if you can moderate someone elses comment', () => {
      const props = mapStateToProps(state, { groupSlug: 'foo', comment: myComment })
      expect(props.canModerate).toBeFalsy()
    })
  })
})

describe('mergeProps', () => {
  describe('as moderator', () => {
    it('returns a function for deleteComment', () => {
      window.confirm = jest.fn()
      const stateProps = { canModerate: true, isCreator: true }
      const props = mergeProps(stateProps, { fetchCommentsMaker: () => {} }, { comment: { childComments: [] } })
      props.deleteComment(1, 'Are you sure you want to delete this comment?')
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?')
    })

    it('returns a function for removeComment', () => {
      window.confirm = jest.fn()
      const stateProps = { canModerate: true, isCreator: false }
      const props = mergeProps(stateProps, { fetchCommentsMaker: () => {} }, { comment: { childComments: [] } })
      props.removeComment(1, 'Are you sure you want to remove this comment?')
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove this comment?')
    })
  })
})
