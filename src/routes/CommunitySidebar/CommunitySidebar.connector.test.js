import { mapStateToProps } from './CommunitySidebar.connector'
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
    expect(mapStateToProps(state, { match: {} })).toMatchSnapshot()
  })
})
