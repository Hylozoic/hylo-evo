import { register } from './Signup.store'

describe('register', () => {
  it('should match latest snapshot', () => {
    expect(register('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
  })
})
