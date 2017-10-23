import { mapStateToProps, mapDispatchToProps, mergeProps } from './CommunitySettings.connector'
import orm from 'store/models'

let state
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

  state = {
    orm: session.state
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, {match: {params: {slug: 'foo'}}})).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('maps the action generators', () => {
    const dispatch = x => x
    const props = {}
    // fetchCommunitySettingsMaker
    // updateCommunitySettingsMaker
    const result = mapDispatchToProps(dispatch, props)
    expect(result).toMatchSnapshot()
    expect(result.fetchCommunitySettingsMaker('anyslug')()).toMatchSnapshot()
    expect(result.updateCommunitySettingsMaker('anyslug')({name: 'a new name'})).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('merges the props', () => {
    const stateProps = {
      slug: 'bar',
      community: {
        id: 99
      }
    }
    const dispatchProps = {
      fetchCommunitySettingsMaker: jest.fn(x => x),
      updateCommunitySettingsMaker: jest.fn(x => x)
    }
    const ownProps = {}
    const mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    expect(mergedProps).toMatchSnapshot()
  })
})
