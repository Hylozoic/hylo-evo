import { partitionGroups, mapStateToProps } from './Drawer.connector'
import getMyMemberships from 'store/selectors/getMyMemberships'
import orm from 'store/models'

describe('partitionGroups', () => {
  it('separates independent groups from networked groups', () => {
    const session = orm.session(orm.getEmptyState())
    const network = session.Network.create({ name: 'networkOne', id: '1111' })
    const group1 = session.group.create({ id: '1', name: 'one', network: network.id })
    const group2 = session.group.create({ id: '100', name: 'nonMembergroup', network: network.id })
    network.updateAppending({ groups: [group1.id, group2.id] })

    const group3 = session.group.create({ id: '2', name: 'two' })
    const membership = session.Membership.create({ id: 'm1', group: group1.id, newPostCount: 5 })
    const membership2 = session.Membership.create({ id: 'm2', group: group3.id, newPostCount: 3 })
    const me = session.Me.create({})
    me.updateAppending({ memberships: [membership.id, membership2.id] })

    const partitionedGroups = partitionGroups(getMyMemberships({ orm: session.state }))
    expect(partitionedGroups).toMatchSnapshot()
    expect(partitionedGroups.networks[0].nonMemberGroups[0].id).toEqual('100')
  })
})

describe('mapStateToProps', () => {
  it('returns the right keys, adding All Groups link', () => {
    const session = orm.session(orm.getEmptyState())
    const group = session.group.create({ id: '99', slug: 'foo' })
    session.group.create({ id: '88', slug: 'bar' })

    session.Me.create({
      id: '1',
      memberships: [session.Membership.create({
        id: '345',
        group: group.id,
        hasModeratorRole: true
      })]
    })

    expect(mapStateToProps({ orm: session.state, locationHistory: { currentLocation: 'mock' } }, { group })).toMatchSnapshot()
  })
})
