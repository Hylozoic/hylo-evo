import { mapDispatchToProps, mapStateToProps } from './FinishRegistration.connector'

describe('FinishRegistration.connector', () => {
  it('should call signup', () => {
    expect(mapDispatchToProps.signup('test@hylo.com', 'name', 'password')).toMatchSnapshot()
  })

  it('returns the right keys', () => {
    const cookies = {
      get: (a) => 'whee@pony.com'
    }
    expect(mapStateToProps({}, { cookies, location: { search: '' } }).email).toEqual('whee@pony.com')
    expect(mapStateToProps({}, { cookies, location: { search: '' } }).hasOwnProperty('error')).toBeTruthy()
    expect(mapStateToProps({}, { cookies, location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
  })
})
