import orm from 'store/models' // this initializes redux-orm
import { getCanModerate } from './CommunitySidebar.store'

describe('getCanModerate', () => {
  const session = orm.session(orm.getEmptyState())
  beforeEach(() => {
    session.Me.create({
      id: '1'
    })
  })
  it('returns expected values', () => {
    const community = session.Community.create({id: 1})
    const membership = session.Membership.create({id: 1, community: community.id, hasModeratorRole: true})
    const me = session.Me.first()
    me.updateAppending({memberships: [membership.id]})
    const state = { orm: session.state }
    const props = { community }
    expect(getCanModerate(state, props)).toEqual(true)
  })
})
