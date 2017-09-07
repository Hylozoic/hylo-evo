import { signup } from './Signup.store'

describe('signup', () => {
  it('should match latest snapshot', () => {
    expect(signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
