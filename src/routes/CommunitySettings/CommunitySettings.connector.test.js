import { mapStateToProps, mapDispatchToProps, mergeProps } from './CommunitySettings.connector'
import orm from 'store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const community = session.Community.create({ id: '99', slug: 'foo' })
  session.Community.create({ id: '88', slug: 'bar' })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      community: community.id,
      hasModeratorRole: true
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
          slug: 'foo'
        }
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const slug = 'foo'
    const dispatch = x => x
    const ownProps = {}
    const stateProps = mapStateToProps(state, { match: { params: { slug } } })
    const dispatchProps = mapDispatchToProps(dispatch, stateProps)
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps.fetchCommunitySettings()).toMatchSnapshot()
    expect(mergedProps.updateCommunitySettings()).toMatchSnapshot()
    expect(mergedProps).toMatchSnapshot()
  })
})
