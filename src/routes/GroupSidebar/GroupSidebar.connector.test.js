import { mapStateToProps } from './GroupSidebar.connector'
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
      hasModeratorRole: true
    })]
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
