import { mapStateToProps } from './NetworkSidebar.connector'
import orm from 'store/models'

describe('mapStateToProps', () => {
  let state
  const ownProps = {}

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Network.create({ id: '33', slug: 'foo' })

    session.Me.create({
      id: '1',
      isAdmin: true
    })

    state = {
      orm: session.state
    }
  })

  it('matches the last snapshot', () => {
    expect(mapStateToProps(state, ownProps)).toMatchSnapshot()
  })
})
