import { mapStateToProps, mergeProps } from './Comment.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  let state, myComment, otherComment
  beforeAll(() => {
    const session = orm.session(orm.getEmptyState())
    const community = session.Community.create({id: '99', slug: 'foo'})
    session.Community.create({id: '88', slug: 'bar'})

    session.Me.create({
      id: '1',
      memberships: [session.Membership.create({
        id: '345',
        community: community.id,
        hasModeratorRole: true
      })]
    })
    const meUser = session.Person.create({id: '1'})
    const otherUser = session.Person.create({id: '2'})
    myComment = session.Comment.create({creator: meUser})
    otherComment = session.Comment.create({creator: otherUser})

    state = {
      orm: session.state
    }
  })

  it('sets canModerate to true if you are comment creator', () => {
    const props = mapStateToProps(state, {slug: 'bar', comment: myComment})
    expect(props.canModerate).toBeTruthy()
  })

  it('sets canModerate to true if you can moderate the community', () => {
    const props = mapStateToProps(state, {slug: 'foo', comment: otherComment})
    expect(props.canModerate).toBeTruthy()
  })

  it('sets canModerate to false otherwise', () => {
    const props = mapStateToProps(state, {slug: 'bar', comment: otherComment})
    expect(props.canModerate).toBeFalsy()
  })
})

describe('mergeProps', () => {
  it('returns null for deleteComment when canModerate is false', () => {
    const stateProps = {canModerate: false}
    const props = mergeProps(stateProps, {}, {})
    expect(props.deleteComment).toBeNull()
  })

  it('returns a function for deleteComment when canModerate is true', () => {
    window.confirm = jest.fn()
    const stateProps = {canModerate: true}
    const props = mergeProps(stateProps, {}, {})
    props.deleteComment(1)
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?')
  })
})
