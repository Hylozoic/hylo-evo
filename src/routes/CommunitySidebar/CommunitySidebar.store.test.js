import orm from 'store/models' // this initializes redux-orm
import { getCanModerate } from './CommunitySidebar.store'

describe('CommunitySidebar store', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({
    id: '1'
  })

  it('should call getCanModerate', () => {
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
