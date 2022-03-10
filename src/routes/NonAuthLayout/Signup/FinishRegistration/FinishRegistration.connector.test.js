import orm from 'store/models'
import { mapDispatchToProps, mapStateToProps } from './FinishRegistration.connector'

describe('FinishRegistration.connector', () => {
  let session, state

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '1' })
    state = {
      orm: session.state
    }
  })

  it('should call signup', () => {
    expect(mapDispatchToProps.signup('test@hylo.com', 'name', 'password')).toMatchSnapshot()
  })

  it('returns the right keys', () => {
    expect(mapStateToProps(state, { location: { search: '' } }).currentUser.id).toEqual('1')
    expect(mapStateToProps(state, { location: { search: '' } }).hasOwnProperty('error')).toBeTruthy()
    expect(mapStateToProps(state, { location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
