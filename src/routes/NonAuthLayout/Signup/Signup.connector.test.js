import { mapDispatchToProps } from './Signup.connector'

describe('Signup', () => {
  it('should call signup', () => {
    expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
