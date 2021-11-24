import { mapDispatchToProps, mapStateToProps } from './Signup.connector'

describe('Signup', () => {
  it('should call signup', () => {
    expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
  it('returns the right keys', () => {
    expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('downloadAppUrl')).toBeTruthy()
    expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
    expect(mapStateToProps({ login: { error: 'no mojo' } }, { location: { search: '' } }).error).toEqual('no mojo')
    expect(mapStateToProps({}, { location: { search: '?error=moo' } }).error).toEqual('moo')
  })
})
