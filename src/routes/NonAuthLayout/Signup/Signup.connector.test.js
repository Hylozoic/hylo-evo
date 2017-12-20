import { mapDispatchToProps, mapStateToProps } from './Signup.connector'

describe('Signup', () => {
  it('should call signup', () => {
    expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
  it('returns the right keys', () => {
    expect(mapStateToProps({}, {}).hasOwnProperty('downloadAppUrl')).toBeTruthy()
    expect(mapStateToProps({}, {}).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
