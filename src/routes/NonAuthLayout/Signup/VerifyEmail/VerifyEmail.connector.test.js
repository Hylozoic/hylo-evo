import { mapDispatchToProps, mapStateToProps } from './VerifyEmail.connector'

describe('VerifyEmail.connector', () => {
  it('should call verifyEmail', () => {
    expect(mapDispatchToProps.verifyEmail('test@hylo.com', 'acode')).toMatchSnapshot()
  })

  it('returns the right keys', () => {
    expect(mapStateToProps({}, { location: { search: '?email=test@hylo.com' } }).email).toEqual('test@hylo.com')
    expect(mapStateToProps({ login: { error: 'errrr' } }, { location: { search: '?email=test@hylo.com' } }).error).toEqual('errrr')
  })
})
