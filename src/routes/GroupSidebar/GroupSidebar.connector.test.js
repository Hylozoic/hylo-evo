import { mapStateToProps } from './GroupSidebar.connector'
import orm from 'store/models'

let state
beforeAll(() => {
  const session = orm.session(orm.getEmptyState())
  const group = session.Group.create({ id: '99', slug: 'foo' })
  session.Group.create({ id: '88', slug: 'bar' })
  session.CommonRole.create({ id: 1, name: 'Coordinator', responsibilities: [{ id: 1, name: 'Administration' }] })

  session.Me.create({
    id: '1',
    memberships: [session.Membership.create({
      id: '345',
      group: group.id
    })],
    membershipCommonRoles: [{ commonRoleId: 1, groupId: group.id, userId: 1, id: 1 }]
  })

  state = {
    orm: session.state
  }
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    expect(mapStateToProps(state, { match: {} })).toMatchSnapshot()
  })
})
