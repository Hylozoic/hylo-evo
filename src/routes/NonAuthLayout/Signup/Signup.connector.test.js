import { mapDispatchToProps } from './Signup.connector'

describe('mapDispatchToProps', () => {
  it('signup should match latest snapshot', () => {
    expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
