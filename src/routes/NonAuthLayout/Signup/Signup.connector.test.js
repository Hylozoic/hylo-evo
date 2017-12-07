import { mapDispatchToProps, mapStateToProps } from './Signup.connector'

describe('Signup', () => {
  it('should call signup', () => {
    expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {}
    const props = {}
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})
