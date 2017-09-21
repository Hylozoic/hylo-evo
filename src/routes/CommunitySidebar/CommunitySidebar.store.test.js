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
    const state = { orm: session.state }

    const props = {
      community: {
        id: 1,
        hasModeratorRole: true
      }
    }
    expect(getCanModerate(state, props)).toMatchSnapshot()
  })
})
