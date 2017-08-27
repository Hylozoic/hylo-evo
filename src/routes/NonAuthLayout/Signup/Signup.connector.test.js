import { mapDispatchToProps } from './Signup.connector'

describe('mapDispatchToProps', () => {
  it('signup should match latest snapshot', () => {
    expect(mapDispatchToProps.signup('fullName', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
