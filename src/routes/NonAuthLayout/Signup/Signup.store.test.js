import { signup } from './Signup.store'

describe('signup', () => {
  it('should match latest snapshot', () => {
    expect(signup('fullName', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
