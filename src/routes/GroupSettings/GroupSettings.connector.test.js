import { mapStateToProps, mapDispatchToProps, mergeProps } from './GroupSettings.connector'
import orm from 'store/models'

let state
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
      person: 1
    })]
  })

  state = {
    orm: session.state
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const props = {
      match: {
        params: {
          groupSlug: 'foo'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const groupSlug = 'foo'
    const dispatch = x => x
    const ownProps = {}
    const stateProps = mapStateToProps(state, { match: { params: { groupSlug } } })
    const dispatchProps = mapDispatchToProps(dispatch, stateProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.fetchGroupSettings()).toMatchSnapshot()
    expect(mergedProps.updateGroupSettings()).toMatchSnapshot()
    expect(mergedProps).toMatchSnapshot()
  })
})
