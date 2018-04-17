import { partitionCommunities, mapStateToProps } from './Drawer.connector'
import getMemberships from 'store/selectors/getMemberships'
import orm from 'store/models'

describe('partitionCommunities', () => {
  it('separates independent communities from networked communities', () => {
    const session = orm.session(orm.getEmptyState())
    const network = session.Network.create({name: 'networkOne', id: '1111'})
    const community1 = session.Community.create({id: '1', name: 'one', network: network.id})
    const community2 = session.Community.create({id: '100', name: 'nonMemberCommunity', network: network.id})
    network.updateAppending({communities: [community1.id, community2.id]})

    const community3 = session.Community.create({id: '2', name: 'two'})
    const membership = session.Membership.create({id: 'm1', community: community1.id, newPostCount: 5})
    const membership2 = session.Membership.create({id: 'm2', community: community3.id, newPostCount: 3})
    const me = session.Me.create({})
    me.updateAppending({memberships: [membership.id, membership2.id]})

    const partitionedCommunities = partitionCommunities(getMemberships({orm: session.state}))
    expect(partitionedCommunities).toMatchSnapshot()
    expect(partitionedCommunities.networks[1].nonMemberCommunities[0].id).toEqual('100')
  })
})

describe('mapStateToProps', () => {
  it('returns the right keys, adding All Communities link', () => {
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

    expect(mapStateToProps({orm: session.state}, {community})).toMatchSnapshot()
  })
})
