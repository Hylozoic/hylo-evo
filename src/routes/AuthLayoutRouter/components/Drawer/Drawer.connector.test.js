import { mapStateToProps } from './Drawer.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  it('returns the right keys, adding All Groups link', () => {
    const session = orm.session(orm.getEmptyState())
    const group = session.Group.create({ id: '99', slug: 'foo' })
    session.Group.create({ id: '88', slug: 'bar' })

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
